const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../modelos/User');
const { sendEmail } = require('../utils/notificacao');

// Alterar password
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Senha atual e nova senha são obrigatórias' });
        }
        
        const user = await User.findById(req.user.id);
        
        // Verificar senha atual
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Senha atual incorreta' });
        }
        
        // Hash da nova senha
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        await User.findByIdAndUpdate(req.user.id, { password: hashedPassword });
        
        res.status(200).json({ message: 'Senha alterada com sucesso' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Solicitar recuperação de password
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        
        // Gerar token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        const resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutos
        
        await User.findByIdAndUpdate(user._id, {
            resetPasswordToken,
            resetPasswordExpires
        });
        
        // Enviar email
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        await sendEmail(
            email,
            'Recuperação de Senha - Oficina',
            `Clique no link para resetar sua senha: ${resetUrl}\n\nEste link expira em 10 minutos.`
        );
        
        res.status(200).json({ message: 'Email de recuperação enviado' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Resetar password
exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;
        
        // Hash do token
        const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
        
        // Encontrar usuário com token válido
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpires: { $gt: Date.now() }
        });
        
        if (!user) {
            return res.status(400).json({ message: 'Token inválido ou expirado' });
        }
        
        // Atualizar senha
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        await User.findByIdAndUpdate(user._id, {
            password: hashedPassword,
            resetPasswordToken: undefined,
            resetPasswordExpires: undefined
        });
        
        res.status(200).json({ message: 'Senha resetada com sucesso' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.register = async (req, res) => {
    try {
        const { name, email, password, phone, role } = req.body;
        
        // Verificar se usuário já existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email já cadastrado' });
        }
        
        // Hash da senha
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = new User({
            name,
            email,
            password: hashedPassword,
            phone,
            role: role || 'client'
        });
        
        await user.save();
        
        res.status(201).json({ message: 'Usuário criado com sucesso' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Credenciais inválidas' });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Credenciais inválidas' });
        }
        
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION }
        );
        
        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { name, phone } = req.body;
        
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { name, phone },
            { new: true }
        ).select('-password');
        
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}