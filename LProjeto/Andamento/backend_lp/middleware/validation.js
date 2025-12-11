const { body, param, query, validationResult } = require('express-validator');

// Middleware para tratar erros de validação
exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation errors',
      errors: errors.array()
    });
  }
  next();
};

// Validação de email
const emailValidation = body('email')
  .trim()
  .isEmail()
  .withMessage('Invalid email format')
  .normalizeEmail();

// Validação de password forte
const passwordValidation = body('password')
  .isLength({ min: 8 })
  .withMessage('Password must be at least 8 characters long')
  .matches(/[A-Z]/)
  .withMessage('Password must contain at least one uppercase letter')
  .matches(/[a-z]/)
  .withMessage('Password must contain at least one lowercase letter')
  .matches(/[0-9]/)
  .withMessage('Password must contain at least one number')
  .matches(/[!@#$%^&*(),.?":{}|<>]/)
  .withMessage('Password must contain at least one special character');

// Validação de nome
const nameValidation = body('name')
  .trim()
  .isLength({ min: 2, max: 100 })
  .withMessage('Name must be between 2 and 100 characters')
  .matches(/^[a-zA-ZÀ-ÿ\s]+$/)
  .withMessage('Name can only contain letters and spaces');

// Validação de telefone (formato internacional ou português)
const phoneValidation = body('phone')
  .optional()
  .matches(/^(\+351|00351)?[1-9]\d{8}$/)
  .withMessage('Invalid phone number format (Portuguese format: 9XXXXXXXX or +351 9XXXXXXXX)');

// Validação de data de nascimento
const dateOfBirthValidation = body('dateOfBirth')
  .optional()
  .isISO8601()
  .withMessage('Invalid date format')
  .custom((value) => {
    const birthDate = new Date(value);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    if (age < 13) {
      throw new Error('User must be at least 13 years old');
    }
    if (age > 120) {
      throw new Error('Invalid birth date');
    }
    return true;
  });

// Validação para registro
exports.validateRegister = [
  nameValidation,
  emailValidation,
  passwordValidation,
  dateOfBirthValidation,
  phoneValidation
];

// Validação para login
exports.validateLogin = [
  emailValidation,
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Validação para atualização de perfil
exports.validateProfileUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  dateOfBirthValidation,
  body('currentPassword')
    .optional()
    .notEmpty()
    .withMessage('Current password is required to change password'),
  body('newPassword')
    .optional()
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .matches(/[A-Z]/)
    .withMessage('New password must contain at least one uppercase letter')
    .matches(/[a-z]/)
    .withMessage('New password must contain at least one lowercase letter')
    .matches(/[0-9]/)
    .withMessage('New password must contain at least one number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage('New password must contain at least one special character')
];

// Validação de Game ID
exports.validateGameId = [
  param('gameId')
    .isInt({ min: 1 })
    .withMessage('Game ID must be a positive integer')
];

// Validação de rating de jogo
exports.validateGameRating = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('comment')
    .optional()
    .isString()
    .isLength({ max: 1000 })
    .withMessage('Comment cannot exceed 1000 characters')
    .trim()
];

// Validação de pesquisa
exports.validateSearch = [
  query('search')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search term must be between 1 and 100 characters'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
];

// Validação de item no carrinho
exports.validateCartItem = [
  body('gameId')
    .isInt({ min: 1 })
    .withMessage('Game ID must be a positive integer'),
  body('gameName')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Game name is required')
    .isLength({ max: 200 })
    .withMessage('Game name cannot exceed 200 characters'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number')
];

// Validação de wishlist item
exports.validateWishlistItem = [
  body('gameId')
    .isInt({ min: 1 })
    .withMessage('Game ID must be a positive integer'),
  body('gameName')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Game name is required')
    .isLength({ max: 200 })
    .withMessage('Game name cannot exceed 200 characters')
];

// Validação de método de pagamento
exports.validatePaymentMethod = [
  body('paymentMethod')
    .isIn(['credit_card', 'debit_card', 'paypal', 'bank_transfer'])
    .withMessage('Invalid payment method. Must be: credit_card, debit_card, paypal, or bank_transfer')
];

// Validação de settings
exports.validateSettings = [
  body('showExplicitContent')
    .optional()
    .isBoolean()
    .withMessage('showExplicitContent must be a boolean'),
  body('newsletter')
    .optional()
    .isBoolean()
    .withMessage('newsletter must be a boolean')
];

// Validação para criação de admin
exports.validateAdminCreation = [
  nameValidation,
  emailValidation,
  passwordValidation,
  phoneValidation
];

// Validação para notificação
exports.validateNotification = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ max: 1000 })
    .withMessage('Message cannot exceed 1000 characters'),
  body('type')
    .optional()
    .isIn(['service', 'reminder', 'promotion'])
    .withMessage('Invalid notification type')
];
