const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { 
  validateRegister,
  validateLogin,
  validateProfileUpdate,
  validateSettings,
  handleValidationErrors 
} = require('../middleware/validation');

// Public routes
router.post('/register', 
  validateRegister, 
  handleValidationErrors, 
  authController.register
);

router.post('/login', 
  validateLogin, 
  handleValidationErrors, 
  authController.login
);

// Protected routes
router.get('/me', 
  protect, 
  authController.getMe
);

router.put('/profile', 
  protect, 
  validateProfileUpdate, 
  handleValidationErrors, 
  authController.updateProfile
);

router.put('/settings', 
  protect, 
  validateSettings, 
  handleValidationErrors, 
  authController.updateSettings
);

module.exports = router;
