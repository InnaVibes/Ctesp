const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, authorize, ownerOnly } = require('../middleware/auth');

// Todas as rotas requerem autenticação e role admin ou owner
router.use(protect);
router.use(authorize('admin', 'owner'));

// Estatísticas
router.get('/stats', adminController.getStats);

// Gestão de utilizadores
router.get('/users', adminController.getAllUsers);
router.get('/users/:userId', adminController.getUserById);
router.put('/users/:userId', adminController.updateUser);
router.patch('/users/:userId/toggle-active', adminController.toggleUserActive);

// Apenas Owner pode eliminar utilizadores
router.delete('/users/:userId', ownerOnly, adminController.deleteUser);

// Gestão de jogos
router.get('/games', adminController.getAllGames);
router.put('/games/:gameId', adminController.updateGame);
router.patch('/games/:gameId/toggle-active', adminController.toggleGameActive);
router.delete('/games/:gameId/ratings/:ratingId', adminController.deleteGameRating);

module.exports = router;