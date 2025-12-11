const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Verificar se está autenticado (obrigatório) - novo formato
exports.protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. Please login to continue.',
        requiresAuth: true
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'chave-secreta');
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not found.',
          requiresAuth: true
        });
      }

      if (!req.user.isActive) {
        return res.status(403).json({
          success: false,
          message: 'Account deactivated. Contact support.'
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token. Please login again.',
        requiresAuth: true
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Autenticação opcional - permite guest e authenticated users
exports.optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Se não houver token, continua como GUEST
    if (!token) {
      req.user = null;
      req.isGuest = true;
      return next();
    }

    // Se houver token, tenta validar
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'chave-secreta');
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user || !req.user.isActive) {
        req.user = null;
        req.isGuest = true;
      } else {
        req.isGuest = false;
      }
      
      next();
    } catch (error) {
      // Token inválido - continua como guest
      req.user = null;
      req.isGuest = true;
      next();
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Middleware para verificar se é cliente (não permite guests)
exports.clientOnly = (req, res, next) => {
  if (req.isGuest || !req.user) {
    return res.status(401).json({
      success: false,
      message: 'Login required to perform this action.',
      requiresAuth: true,
      action: 'login_required'
    });
  }
  
  if (req.user.role !== 'client') {
    return res.status(403).json({
      success: false,
      message: 'Only clients can perform this action.'
    });
  }
  
  next();
};

// Verificar se é admin
exports.isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false,
      error: 'Access denied. Admin only.' 
    });
  }
  next();
};

// Verificar se é client
exports.isClient = (req, res, next) => {
  if (!req.user || req.user.role !== 'client') {
    return res.status(403).json({ 
      success: false,
      error: 'Access denied. Clients only.' 
    });
  }
  next();
};

// Verificar se é owner
exports.isOwner = (req, res, next) => {
  if (!req.user || req.user.role !== 'owner') {
    return res.status(403).json({ 
      success: false,
      error: 'Access denied. Owner only.' 
    });
  }
  next();
};

// Verificar se é admin ou owner
exports.isAdminOrOwner = (req, res, next) => {
  if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'owner')) {
    return res.status(403).json({ 
      success: false,
      error: 'Access denied. Admin or Owner only.' 
    });
  }
  next();
};

// Verificar se é admin ou client
exports.isAdminOrClient = (req, res, next) => {
  if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'client')) {
    return res.status(403).json({ 
      success: false,
      error: 'Access denied.' 
    });
  }
  next();
};

// Verificar roles específicos
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user?.role || 'none'}' is not authorized to access this resource.`
      });
    }
    next();
  };
};

// Legacy - Verificar token (usado em rotas antigas)
exports.authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'chave-secreta', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};
