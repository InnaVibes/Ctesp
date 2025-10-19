const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { 
  validateRegister, 
  validateLogin, 
  validateUpdateProfile,
  handleValidationErrors 
} = require('../middleware/validation');

// Rotas públicas
router.post('/register', validateRegister, handleValidationErrors, authController.register);
router.post('/login', validateLogin, handleValidationErrors, authController.login);

// Rotas protegidas
router.get('/me', protect, authController.getMe);
router.put('/profile', protect, validateUpdateProfile, handleValidationErrors, authController.updateProfile);
router.put('/settings', protect, authController.updateSettings);

module.exports = router;