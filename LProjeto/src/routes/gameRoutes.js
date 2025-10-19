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

// Rotas públicas
router.get('/homepage', gameController.getHomepage);
router.get('/search', validateSearch, handleValidationErrors, gameController.searchGames);
router.get('/:gameId', validateGameId, handleValidationErrors, gameController.getGameDetails);
router.get('/:gameId/ratings', validateGameId, handleValidationErrors, gameController.getGameRatings);

// Rotas protegidas
router.post('/:gameId/rating', protect, validateGameId, validateGameRating, handleValidationErrors, gameController.addGameRating);

module.exports = router;