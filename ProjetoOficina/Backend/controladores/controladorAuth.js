const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../modelos/User');
const { sendEmail } = require('../utils/notificacao');
const { schemas, validate } = require('../middlewares/validation');

// Registrar usuário
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
        
        // Enviar email de boas-vindas (opcional)
        try {
            await sendEmail(
                email,
                'Bem-vindo à Oficina!',
                `Olá ${name}! Sua conta foi criada com sucesso. Bem-vindo à nossa oficina!`
            );
        } catch (emailError) {
            console.log('Erro ao enviar email de boas-vindas:', emailError);
        }
        
        res.status(201).json({ 
            message: 'Usuário criado com sucesso',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Erro no registro:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

// Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Verificar se usuário existe
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Credenciais inválidas' });
        }
        
        // Verificar se usuário está ativo
        if (!user.isActive) {
            return res.status(400).json({ message: 'Conta desativada. Entre em contato com o suporte.' });
        }
        
        // Verificar senha
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Credenciais inválidas' });
        }
        
        // Gerar token JWT
        const token = jwt.sign(
            { 
                id: user._id, 
                role: user.role,
                email: user.email 
            },
            process.env.JWT_SECRET,
            { 
                expiresIn: process.env.JWT_EXPIRATION || '1h',
                issuer: process.env.JWT_ISSUER || 'oficina-api',
                audience: process.env.JWT_AUDIENCE || 'oficina-client'
            }
        );
        
        // Atualizar último login (opcional)
        user.lastLogin = new Date();
        await user.save();
        
        res.json({
            message: 'Login realizado com sucesso',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone
            }
        });
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

// Obter perfil do usuário
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password -resetPasswordToken -resetPasswordExpires');
        
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        
        res.json(user);
    } catch (error) {
        console.error('Erro ao obter perfil:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

// Atualizar perfil
exports.updateProfile = async (req, res) => {
    try {
        const { name, phone } = req.body;
        
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { 
                name, 
                phone,
                updatedAt: new Date()
            },
            { new: true, runValidators: true }
        ).select('-password -resetPasswordToken -resetPasswordExpires');
        
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        
        res.json({
            message: 'Perfil atualizado com sucesso',
            user
        });
    } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

// Alterar senha
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Senha atual e nova senha são obrigatórias' });
        }
        
        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Nova senha deve ter pelo menos 6 caracteres' });
        }
        
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        
        // Verificar senha atual
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Senha atual incorreta' });
        }
        
        // Hash da nova senha
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        await User.findByIdAndUpdate(req.user.id, { 
            password: hashedPassword,
            updatedAt: new Date()
        });
        
        res.json({ message: 'Senha alterada com sucesso' });
    } catch (error) {
        console.error('Erro ao alterar senha:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

// Solicitar recuperação de senha
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ message: 'Email é obrigatório' });
        }
        
        const user = await User.findOne({ email });
        if (!user) {
            // Por segurança, sempre retornar sucesso
            return res.json({ message: 'Se o email estiver cadastrado, você receberá instruções para redefinir a senha' });
        }
        
        // Gerar token de reset
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        const resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutos
        
        await User.findByIdAndUpdate(user._id, {
            resetPasswordToken,
            resetPasswordExpires
        });
        
        // Enviar email
        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;
        
        try {
            await sendEmail(
                email,
                'Recuperação de Senha - Oficina',
                `Você solicitou a recuperação de senha. Clique no link para resetar sua senha: ${resetUrl}\n\nEste link expira em 10 minutos.\n\nSe você não solicitou esta recuperação, ignore este email.`
            );
        } catch (emailError) {
            console.error('Erro ao enviar email:', emailError);
            return res.status(500).json({ message: 'Erro ao enviar email de recuperação' });
        }
        
        res.json({ message: 'Se o email estiver cadastrado, você receberá instruções para redefinir a senha' });
    } catch (error) {
        console.error('Erro na recuperação de senha:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

// Resetar senha
exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;
        
        if (!newPassword) {
            return res.status(400).json({ message: 'Nova senha é obrigatória' });
        }
        
        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Nova senha deve ter pelo menos 6 caracteres' });
        }
        
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
            resetPasswordExpires: undefined,
            updatedAt: new Date()
        });
        
        res.json({ message: 'Senha resetada com sucesso' });
    } catch (error) {
        console.error('Erro ao resetar senha:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

// Verificar token (middleware para rotas protegidas)
exports.verifyToken = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password -resetPasswordToken -resetPasswordExpires');
        
        if (!user || !user.isActive) {
            return res.status(401).json({ message: 'Token inválido' });
        }
        
        res.json({
            valid: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone
            }
        });
    } catch (error) {
        console.error('Erro ao verificar token:', error);
        res.status(401).json({ message: 'Token inválido' });
    }
};

// Logout (opcional - para invalidar token no lado servidor)
exports.logout = async (req, res) => {
    try {
        // Em uma implementação real, você poderia manter uma blacklist de tokens
        // ou usar refresh tokens. Por enquanto, apenas retornamos sucesso.
        res.json({ message: 'Logout realizado com sucesso' });
    } catch (error) {
        console.error('Erro no logout:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

// Obter todos os usuários (apenas admin)
exports.getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', role = '' } = req.query;
        
        // Construir query de busca
        let query = {};
        
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }
        
        if (role) {
            query.role = role;
        }
        
        const skip = (page - 1) * limit;
        
        const [users, total] = await Promise.all([
            User.find(query)
                .select('-password -resetPasswordToken -resetPasswordExpires')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            User.countDocuments(query)
        ]);
        
        res.json({
            users,
            pagination: {
                current: parseInt(page),
                total: Math.ceil(total / limit),
                count: total,
                limit: parseInt(limit)
            }
        });
    } catch (error) {
        console.error('Erro ao obter usuários:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

// Atualizar usuário (apenas admin)
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, role, isActive } = req.body;
        
        const user = await User.findByIdAndUpdate(
            id,
            { 
                name, 
                email, 
                phone, 
                role, 
                isActive,
                updatedAt: new Date()
            },
            { new: true, runValidators: true }
        ).select('-password -resetPasswordToken -resetPasswordExpires');
        
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        
        res.json({
            message: 'Usuário atualizado com sucesso',
            user
        });
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

// Desativar usuário (apenas admin)
exports.deactivateUser = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (id === req.user.id) {
            return res.status(400).json({ message: 'Não é possível desativar sua própria conta' });
        }
        
        const user = await User.findByIdAndUpdate(
            id,
            { 
                isActive: false,
                updatedAt: new Date()
            },
            { new: true }
        ).select('-password -resetPasswordToken -resetPasswordExpires');
        
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        
        res.json({
            message: 'Usuário desativado com sucesso',
            user
        });
    } catch (error) {
        console.error('Erro ao desativar usuário:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};