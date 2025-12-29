import { Response } from 'express';
import { User } from '../models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { AuthRequest } from '../middlewares/auth.middleware';

const SECRET_KEY = "pwa_secret_key"; 

export const register = async (req: AuthRequest, res: Response) => {
  try {
    const { username, password, role, profileImage } = req.body;
    
    let assignedPtId = undefined;
    let isValidated = false;

    // Se um PT estiver a criar um Cliente, associa-o imediatamente
    if (req.user && req.user.role === 'PT' && role === 'CLIENT') {
        assignedPtId = req.user._id;
        isValidated = true; 
    } else {
        // Registo público: PTs precisam de validação do Admin, Clientes entram diretos (ou conforme regra de negócio)
        isValidated = role === 'PT' ? false : true; 
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "O nome de utilizador já existe." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      password: hashedPassword,
      role: role || 'CLIENT',
      profileImage,
      ptId: assignedPtId,
      isValidated: isValidated
    });

    await newUser.save();

    const userResponse = newUser.toObject();
    // @ts-ignore 
    delete userResponse.password;

    res.status(201).json(userResponse);
  } catch (err) {
    console.error("Erro no registo:", err);
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

    // Gerar token JWT
    const token = jwt.sign(
      { _id: user._id, role: user.role }, 
      SECRET_KEY, 
      { expiresIn: '1h' }
    );

    const userResponse = user.toObject();
    // @ts-ignore
    delete userResponse.password;

    res.json({ token, user: userResponse });
  } catch (err) {
    console.error("Erro no login:", err);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
};

export const qrLogin = async (req: AuthRequest, res: Response) => {
    const { qrToken } = req.body;
    // Simulação: Num cenário real, validaríamos o token contra uma sessão ativa na BD
    if(qrToken === "valid_qr_code") {
        res.json({ message: "Login por QR Code realizado com sucesso", token: "mock_jwt_token" });
    } else {
        res.status(400).json({ message: "Código QR inválido" });
    }
};