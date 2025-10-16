const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Gerar JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @desc    Registar novo utilizador
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, dateOfBirth } = req.body;

    // Verificar se o email já existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'Email já está registado'
      });
    }

    // Criar utilizador
    const user = await User.create({
      name,
      email,
      password,
      dateOfBirth,
      role: 'user'
    });

    // Gerar token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Conta criada com sucesso',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isAdult: user.isAdult,
          age: user.age
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao criar conta',
      error: error.message
    });
  }
};

// @desc    Login de utilizador
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar se utilizador existe e obter password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
    }

    // Verificar se conta está ativa
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Conta desativada. Contacte o suporte.'
      });
    }

    // Verificar password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
    }

    // Gerar token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login realizado com sucesso',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isAdult: user.isAdult,
          age: user.age,
          settings: user.settings
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao fazer login',
      error: error.message
    });
  }
};

// @desc    Obter utilizador atual
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isAdult: user.isAdult,
        age: user.age,
        dateOfBirth: user.dateOfBirth,
        settings: user.settings,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao obter perfil',
      error: error.message
    });
  }
};

// @desc    Atualizar perfil do utilizador
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, dateOfBirth, currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select('+password');

    // Atualizar campos básicos
    if (name) user.name = name;
    if (email) user.email = email;
    if (dateOfBirth) user.dateOfBirth = dateOfBirth;

    // Alterar password se fornecida
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: 'Password atual é necessária para alterar a password'
        });
      }

      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Password atual incorreta'
        });
      }

      user.password = newPassword;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Perfil atualizado com sucesso',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isAdult: user.isAdult,
        age: user.age
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar perfil',
      error: error.message
    });
  }
};

// @desc    Atualizar definições do utilizador
// @route   PUT /api/auth/settings
// @access  Private
exports.updateSettings = async (req, res) => {
  try {
    const { showExplicitContent, newsletter } = req.body;
    const user = await User.findById(req.user.id);

    // Verificar se é maior de 18 para conteúdo explícito
    if (showExplicitContent && !user.isAdult) {
      return res.status(403).json({
        success: false,
        message: 'Necessário ser maior de 18 anos para ativar conteúdo explícito'
      });
    }

    if (showExplicitContent !== undefined) {
      user.settings.showExplicitContent = showExplicitContent;
    }
    if (newsletter !== undefined) {
      user.settings.newsletter = newsletter;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Definições atualizadas com sucesso',
      data: {
        settings: user.settings
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar definições',
      error: error.message
    });
  }
};