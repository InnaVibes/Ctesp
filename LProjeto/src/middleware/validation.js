const { body, param, query, validationResult } = require('express-validator');

// Middleware para processar erros de validação
exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Erros de validação',
      errors: errors.array()
    });
  }
  next();
};

// Validações para registo
exports.validateRegister = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome deve ter entre 2 e 100 caracteres'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email inválido'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password deve ter no mínimo 6 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password deve conter maiúsculas, minúsculas e números'),
  body('dateOfBirth')
    .isISO8601()
    .toDate()
    .withMessage('Data de nascimento inválida')
    .custom((value) => {
      const age = Math.floor((new Date() - new Date(value)) / 31557600000);
      if (age < 8) {
        throw new Error('Idade mínima: 8 anos');
      }
      return true;
    })
];

// Validações para login
exports.validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email inválido'),
  body('password')
    .notEmpty()
    .withMessage('Password é obrigatória')
];

// Validações para atualização de perfil
exports.validateUpdateProfile = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome deve ter entre 2 e 100 caracteres'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Email inválido'),
  body('dateOfBirth')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('Data de nascimento inválida')
];

// Validações para rating de jogo
exports.validateGameRating = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating deve ser entre 1 e 5'),
  body('comment')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Comentário não pode exceder 1000 caracteres')
];

// Validações para ID de jogo
exports.validateGameId = [
  param('gameId')
    .isInt()
    .withMessage('ID de jogo inválido')
];

// Validações para ID de utilizador
exports.validateUserId = [
  param('userId')
    .isMongoId()
    .withMessage('ID de utilizador inválido')
];

// Validações para carrinho
exports.validateCartItem = [
  body('gameId')
    .isInt()
    .withMessage('ID de jogo inválido'),
  body('gameName')
    .trim()
    .notEmpty()
    .withMessage('Nome do jogo é obrigatório'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Preço inválido')
];

// Validações para pesquisa
exports.validateSearch = [
  query('search')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Termo de pesquisa inválido'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Página deve ser um número positivo'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limite deve ser entre 1 e 100')
];