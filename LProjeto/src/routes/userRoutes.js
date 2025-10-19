const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { validateCartItem, handleValidationErrors } = require('../middleware/validation');

// Todas as rotas são protegidas
router.use(protect);

// Biblioteca
router.get('/library', userController.getLibrary);

// Wishlist
router.get('/wishlist', userController.getWishlist);
router.post('/wishlist', userController.addToWishlist);
router.delete('/wishlist/:gameId', userController.removeFromWishlist);

// Carrinho
router.get('/cart', userController.getCart);
router.post('/cart', validateCartItem, handleValidationErrors, userController.addToCart);
router.delete('/cart/:gameId', userController.removeFromCart);
router.delete('/cart', userController.clearCart);

module.exports = router;