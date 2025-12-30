import { Response } from 'express';
import { User } from '../models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { AuthRequest } from '../middlewares/auth.middleware';
import { transporter, emailTemplates } from '../config/email';

const SECRET_KEY = process.env.JWT_SECRET || "pwa_secret_key";
const FRONTEND_URL = "http://localhost:3001";

export const register = async (req: AuthRequest, res: Response) => {
  try {
    const { username, password, role, profileImage, email } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({ message: "Email é obrigatório." });
    }
    
    let assignedPtId = undefined;
    let isValidated = false;

    if (req.user && req.user.role === 'PT' && role === 'CLIENT') {
        assignedPtId = req.user._id;
        isValidated = true; 
    } else {
        isValidated = role === 'PT' ? false : true; 
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "O nome de utilizador já existe." });
    }

    const existingEmail = await User.findOne({ email: email.trim() });
    if (existingEmail) {
      return res.status(400).json({ message: "O email já está registado." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      password: hashedPassword,
      role: role || 'CLIENT',
      profileImage,
      email: email.trim(),
      ptId: assignedPtId,
      isValidated: isValidated
    });

    await newUser.save();

    const { password: _, ...userResponse } = newUser.toObject();

    res.status(201).json(userResponse);
  } catch (err) {
    res.status(500).json({ error: "Erro ao registar utilizador." });
  }
};

export const login = async (req: AuthRequest, res: Response) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: "Credenciais inválidas" });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({ message: "Credenciais inválidas" });
    }

    const token = jwt.sign(
      { _id: user._id, role: user.role }, 
      SECRET_KEY, 
      { expiresIn: '1h' }
    );

    const { password: _, ...userResponse } = user.toObject();

    res.json({ token, user: userResponse });
  } catch (err) {
    res.status(500).json({ error: "Erro interno no servidor." });
  }
};

export const qrLogin = async (req: AuthRequest, res: Response) => {
    const { qrToken } = req.body;
    if(qrToken === "valid_qr_code") {
        res.json({ message: "Login por QR Code realizado com sucesso", token: "mock_jwt_token" });
    } else {
        res.status(400).json({ message: "Código QR inválido" });
    }
};

export const forgotPassword = async (req: AuthRequest, res: Response) => {
  try {
    const { identifier } = req.body;

    if (!identifier) {
      return res.status(400).json({ message: "Username ou email é obrigatório" });
    }

    const user = await User.findOne({
      $or: [
        { username: identifier.trim() },
        { email: identifier.trim() }
      ]
    });

    if (!user) {
      return res.json({ 
        message: "Se este utilizador existir, receberá um email com instruções para redefinir a senha." 
      });
    }

    if (!user.email) {
      return res.status(400).json({ 
        message: "Este utilizador não tem email registado. Contacte o administrador." 
      });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000);
    await user.save();

    const resetLink = `${FRONTEND_URL}/reset-password/${resetToken}`;

    const emailContent = emailTemplates.passwordReset(user.username, resetLink);

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
    });

    res.json({ 
      message: "Se este utilizador existir, receberá um email com instruções para redefinir a senha." 
    });

  } catch (err) {
    res.status(500).json({ error: "Erro ao processar pedido." });
  }
};

export const validateResetToken = async (req: AuthRequest, res: Response) => {
  try {
    const { token } = req.params;

    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ 
        message: "Token inválido ou expirado. Solicite uma nova recuperação de senha." 
      });
    }

    res.json({ 
      valid: true,
      username: user.username 
    });

  } catch (err) {
    res.status(500).json({ error: "Erro ao validar token." });
  }
};

export const resetPassword = async (req: AuthRequest, res: Response) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ 
        message: "A senha deve ter pelo menos 6 caracteres." 
      });
    }

    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ 
        message: "Token inválido ou expirado. Solicite uma nova recuperação de senha." 
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    if (user.email) {
      const emailContent = emailTemplates.passwordChanged(user.username);
      
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text,
      });
    }

    res.json({ 
      message: "Senha redefinida com sucesso! Pode agora fazer login com a nova senha." 
    });

  } catch (err) {
    console.error('Erro ao redefinir senha:', err);
    res.status(500).json({ error: "Erro ao redefinir senha." });
  }
};