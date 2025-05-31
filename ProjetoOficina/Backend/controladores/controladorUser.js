const crypto = require('crypto');

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