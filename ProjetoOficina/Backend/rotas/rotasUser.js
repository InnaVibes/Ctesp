const express = require('express');
const { 
    register, 
    login, 
    getProfile, 
    updateProfile, 
    getAllUsers,
    changePassword,
    forgotPassword,
    resetPassword
} = require('../controladores/controladorUser');
const { auth, admin } = require('../middlewares/autorizacao');
const router = express.Router();

// Rotas públicas
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// Rotas protegidas
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.put('/change-password', auth, changePassword);
router.get('/', auth, admin, getAllUsers);

module.exports = router;