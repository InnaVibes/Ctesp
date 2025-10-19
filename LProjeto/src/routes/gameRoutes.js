const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const { protect } = require('../middleware/auth');
const { 
  validateGameId, 
  validateGameRating, 
  validateSearch,
  handleValidationErrors 
} = require('../middleware/validation');

// Middleware para autenticação opcional
const optionalAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return next(); // Continua sem usuario
  }

  // Se houver token, valida
  protect(req, res, next);
};

// Rotas públicas (sem autenticação obrigatória)
router.get('/homepage', optionalAuth, gameController.getHomepage);
router.get('/search', optionalAuth, validateSearch, handleValidationErrors, gameController.searchGames);
router.get('/:gameId', optionalAuth, validateGameId, handleValidationErrors, gameController.getGameDetails);
router.get('/:gameId/ratings', validateGameId, handleValidationErrors, gameController.getGameRatings);

// Rotas protegidas
router.post('/:gameId/rating', protect, validateGameId, validateGameRating, handleValidationErrors, gameController.addGameRating);

module.exports = router;