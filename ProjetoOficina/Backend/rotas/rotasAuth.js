const express = require('express');
const { 
    register, 
    login, 
    getProfile, 
    updateProfile, 
    changePassword,
    forgotPassword,
    resetPassword,
    verifyToken,
    logout,
    getAllUsers,
    updateUser,
    deactivateUser
} = require('../controladores/controladorAuth');
const { auth, admin } = require('../middlewares/autorizacao');
const { schemas, validate } = require('../middlewares/validation');

const router = express.Router();

// Rotas públicas (não requerem autenticação)
router.post('/register', validate(schemas.user), register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// Rotas protegidas (requerem autenticação)
router.use(auth); // Aplicar middleware de autenticação para todas as rotas abaixo

// Perfil do usuário
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/verify-token', verifyToken);
router.post('/logout', logout);

// Alteração de senha
router.put('/change-password', changePassword);

// Rotas administrativas (requerem role admin)
router.get('/admin/users', admin, getAllUsers);
router.put('/admin/users/:id', admin, updateUser);
router.put('/admin/users/:id/deactivate', admin, deactivateUser);

module.exports = router;