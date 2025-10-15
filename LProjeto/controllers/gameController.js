const Game = require('../models/Game');
const User = require('../models/User');
const rawgService = require('../services/rawgService');
const cheapSharkService = require('../services/cheapSharkService');

// @desc    Obter homepage com jogos em destaque
// @route   GET /api/games/homepage
// @access  Public
exports.getHomepage = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    let user = null;

    if (userId) {
      user = await User.findById(userId);
    }

    // Construir query baseada nas permissões do utilizador
    const query = { isActive: true };
    
    if (!user || !user.isAdult || !user.settings.showExplicitContent) {
      query.isExplicit = false;
    }

    // Jogos mais recentes
    const recentGames = await Game.find(query)
      .sort({ released: -1 })
      .limit(10)
      .select('-userRatings');

    // Jogos mais populares (por ratings)
    const popularGames = await Game.find(query)
      .sort({ ratingsCount: -1 })
      .limit(10)
      .select('-userRatings');

    // Jogos melhor classificados
    const topRatedGames = await Game.find(query)
      .sort({ averageUserRating: -1, totalUserRatings: -1 })
      .limit(10)
      .select('-userRatings');

    res.status(200).json({
      success: true,
      data: {
        recent: recentGames,
        popular: popularGames,
        topRated: topRatedGames
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao obter homepage',
      error: error.message
    });
  }
};

// @desc    Pesquisar jogos
// @route   GET /api/games/search
// @access  Public
exports.searchGames = async (req, res) => {
  try {
    const { search, page = 1, limit = 20, sortBy = '-released' } = req.query;
    const userId = req.user ? req.user.id : null;
    let user = null;

    if (userId) {
      user = await User.findById(userId);
    }

    const query = { isActive: true };

    if (search) {
      query.$text = { $search: search };
    }

    if (!user || !user.isAdult || !user.settings.showExplicitContent) {
      query.isExplicit = false;
    }

    const games = await Game.find(query)
      .sort(sortBy)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .select('-userRatings');

    const total = await Game.countDocuments(query);

    res.status(200).json({
      success: true,
      count: games.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: games
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao pesquisar jogos',
      error: error.message
    });
  }
};

// @desc    Obter detalhes de um jogo
// @route   GET /api/games/:gameId
// @access  Public
exports.getGameDetails = async (req, res) => {
  try {
    const { gameId } = req.params;
    const userId = req.user ? req.user.id : null;
    let user = null;

    if (userId) {
      user = await User.findById(userId);
    }

    let game = await Game.findOne({ rawgId: parseInt(gameId), isActive: true });

    // Verificar permissões de conteúdo explícito
    if (game && game.isExplicit) {
      if (!user || !user.isAdult || !user.settings.showExplicitContent) {
        return res.status(403).json({
          success: false,
          message: 'Conteúdo explícito. Ative nas definições se for maior de 18 anos.'
        });
      }
    }

    // Se não existe na BD, buscar da RAWG API
    if (!game) {
      const rawgGame = await rawgService.getGameDetails(gameId);
      
      if (!rawgGame) {
        return res.status(404).json({
          success: false,
          message: 'Jogo não encontrado'
        });
      }

      // Buscar preço da CheapShark
      const priceData = await cheapSharkService.searchGamePrice(rawgGame.name);
      
      const releaseYear = rawgGame.released ? new Date(rawgGame.released).getFullYear() : new Date().getFullYear();
      const price = priceData ? priceData.price : cheapSharkService.generateFallbackPrice(rawgGame.rating || 3, releaseYear);

      // Criar jogo na BD
      game = await Game.create({
        rawgId: rawgGame.id,
        name: rawgGame.name,
        slug: rawgGame.slug,
        description: rawgGame.description_raw,
        released: rawgGame.released,
        backgroundImage: rawgGame.background_image,
        rating: rawgGame.rating,
        ratingTop: rawgGame.rating_top,
        ratingsCount: rawgGame.ratings_count,
        metacritic: rawgGame.metacritic,
        platforms: rawgGame.platforms,
        genres: rawgGame.genres,
        publishers: rawgGame.publishers,
        developers: rawgGame.developers,
        esrbRating: rawgGame.esrb_rating,
        price: {
          amount: price,
          onSale: priceData ? priceData.onSale : false,
          salePrice: priceData && priceData.onSale ? priceData.price : null
        }
      });
    }

    // Verificar se o utilizador possui o jogo
    let userOwnsGame = false;
    if (user) {
      userOwnsGame = user.library.some(item => item.gameId === game.rawgId);
    }

    res.status(200).json({
      success: true,
      data: {
        ...game.toObject(),
        userOwnsGame
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao obter detalhes do jogo',
      error: error.message
    });
  }
};

// @desc    Adicionar rating/comentário a um jogo
// @route   POST /api/games/:gameId/rating
// @access  Private
exports.addGameRating = async (req, res) => {
  try {
    const { gameId } = req.params;
    const { rating, comment } = req.body;
    const user = await User.findById(req.user.id);

    // Verificar se o utilizador possui o jogo
    const ownsGame = user.library.some(item => item.gameId === parseInt(gameId));
    if (!ownsGame) {
      return res.status(403).json({
        success: false,
        message: 'Necessário possuir o jogo para avaliar'
      });
    }

    const game = await Game.findOne({ rawgId: parseInt(gameId) });
    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Jogo não encontrado'
      });
    }

    // Verificar se já avaliou
    const existingRating = game.userRatings.find(r => r.userId.toString() === req.user.id);
    
    if (existingRating) {
      // Atualizar rating existente
      existingRating.rating = rating;
      existingRating.comment = comment;
      existingRating.createdAt = Date.now();
    } else {
      // Adicionar novo rating
      game.userRatings.push({
        userId: req.user.id,
        rating,
        comment
      });
    }

    game.calculateAverageRating();
    await game.save();

    res.status(200).json({
      success: true,
      message: existingRating ? 'Avaliação atualizada' : 'Avaliação adicionada',
      data: {
        averageRating: game.averageUserRating,
        totalRatings: game.totalUserRatings
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao adicionar avaliação',
      error: error.message
    });
  }
};

// @desc    Obter ratings de um jogo
// @route   GET /api/games/:gameId/ratings
// @access  Public
exports.getGameRatings = async (req, res) => {
  try {
    const { gameId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const game = await Game.findOne({ rawgId: parseInt(gameId) })
      .populate('userRatings.userId', 'name');

    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Jogo não encontrado'
      });
    }

    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const ratings = game.userRatings.slice(startIndex, endIndex);

    res.status(200).json({
      success: true,
      count: ratings.length,
      total: game.userRatings.length,
      averageRating: game.averageUserRating,
      data: ratings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao obter avaliações',
      error: error.message
    });
  }
};