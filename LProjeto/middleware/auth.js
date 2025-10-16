const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verificar se está autenticado
exports.protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Não autorizado. Token não fornecido.'
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Utilizador não encontrado.'
        });
      }

      if (!req.user.isActive) {
        return res.status(403).json({
          success: false,
          message: 'Conta desativada. Contacte o suporte.'
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido ou expirado.'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro no servidor',
      error: error.message
    });
  }
};

// Verificar roles específicos
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user.role}' não tem permissão para aceder a este recurso.`
      });
    }
    next();
  };
};

// Verificar se é maior de 18
exports.checkAge = (req, res, next) => {
  if (!req.user.isAdult) {
    return res.status(403).json({
      success: false,
      message: 'Necessário ser maior de 18 anos para aceder a este conteúdo.'
    });
  }
  next();
};

// Verificar se tem configuração para ver conteúdo explícito
exports.checkExplicitContent = (req, res, next) => {
  if (!req.user.isAdult || !req.user.settings.showExplicitContent) {
    return res.status(403).json({
      success: false,
      message: 'Necessário ativar visualização de conteúdo explícito nas definições.'
    });
  }
  next();
};

// Verificar se o owner é o único (para operações críticas)
exports.ownerOnly = async (req, res, next) => {
  if (req.user.role !== 'owner') {
    return res.status(403).json({
      success: false,
      message: 'Apenas o Owner pode realizar esta operação.'
    });
  }
  next();
};