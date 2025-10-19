const User = require('../models/User');
const Game = require('../models/Game');
const Transaction = require('../models/Transaction');

// ============ GESTÃO DE UTILIZADORES ============

// @desc    Obter todos os utilizadores
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, role, isActive, search } = req.query;

    const query = {};
    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao obter utilizadores',
      error: error.message
    });
  }
};

// @desc    Obter utilizador específico
// @route   GET /api/admin/users/:userId
// @access  Private/Admin
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilizador não encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao obter utilizador',
      error: error.message
    });
  }
};

// @desc    Atualizar utilizador
// @route   PUT /api/admin/users/:userId
// @access  Private/Admin
exports.updateUser = async (req, res) => {
  try {
    const { name, email, isActive, role } = req.body;
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilizador não encontrado'
      });
    }

    // Impedir alteração do owner por admins
    if (user.role === 'owner' && req.user.role !== 'owner') {
      return res.status(403).json({
        success: false,
        message: 'Apenas o Owner pode alterar a conta Owner'
      });
    }

    // Impedir que admin se promova a owner
    if (role === 'owner' && req.user.role !== 'owner') {
      return res.status(403).json({
        success: false,
        message: 'Apenas o Owner pode criar contas Owner'
      });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (isActive !== undefined) user.isActive = isActive;
    if (role && req.user.role === 'owner') user.role = role;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Utilizador atualizado com sucesso',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar utilizador',
      error: error.message
    });
  }
};

// @desc    Desativar/Ativar utilizador
// @route   PATCH /api/admin/users/:userId/toggle-active
// @access  Private/Admin
exports.toggleUserActive = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilizador não encontrado'
      });
    }

    // Impedir desativação do owner
    if (user.role === 'owner') {
      return res.status(403).json({
        success: false,
        message: 'Não é possível desativar a conta Owner'
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: `Utilizador ${user.isActive ? 'ativado' : 'desativado'} com sucesso`,
      data: { isActive: user.isActive }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao alterar estado do utilizador',
      error: error.message
    });
  }
};

// @desc    Eliminar utilizador
// @route   DELETE /api/admin/users/:userId
// @access  Private/Owner
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilizador não encontrado'
      });
    }

    // Impedir eliminação do owner
    if (user.role === 'owner') {
      return res.status(403).json({
        success: false,
        message: 'Não é possível eliminar a conta Owner'
      });
    }

    await User.findByIdAndDelete(req.params.userId);

    res.status(200).json({
      success: true,
      message: 'Utilizador eliminado com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao eliminar utilizador',
      error: error.message
    });
  }
};

// ============ GESTÃO DE JOGOS ============

// @desc    Obter todos os jogos (incluindo inativos)
// @route   GET /api/admin/games
// @access  Private/Admin
exports.getAllGames = async (req, res) => {
  try {
    const { page = 1, limit = 20, isActive, isExplicit, search } = req.query;

    const query = {};
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (isExplicit !== undefined) query.isExplicit = isExplicit === 'true';
    if (search) query.$text = { $search: search };

    const games = await Game.find(query)
      .select('-userRatings')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

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
      message: 'Erro ao obter jogos',
      error: error.message
    });
  }
};

// @desc    Atualizar jogo
// @route   PUT /api/admin/games/:gameId
// @access  Private/Admin
exports.updateGame = async (req, res) => {
  try {
    const { isActive, isExplicit, price } = req.body;
    const game = await Game.findOne({ rawgId: parseInt(req.params.gameId) });

    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Jogo não encontrado'
      });
    }

    if (isActive !== undefined) game.isActive = isActive;
    if (isExplicit !== undefined) game.isExplicit = isExplicit;
    if (price) {
      if (price.amount !== undefined) game.price.amount = price.amount;
      if (price.onSale !== undefined) game.price.onSale = price.onSale;
      if (price.salePrice !== undefined) game.price.salePrice = price.salePrice;
    }

    await game.save();

    res.status(200).json({
      success: true,
      message: 'Jogo atualizado com sucesso',
      data: game
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar jogo',
      error: error.message
    });
  }
};

// @desc    Desativar/Ativar jogo
// @route   PATCH /api/admin/games/:gameId/toggle-active
// @access  Private/Admin
exports.toggleGameActive = async (req, res) => {
  try {
    const game = await Game.findOne({ rawgId: parseInt(req.params.gameId) });

    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Jogo não encontrado'
      });
    }

    game.isActive = !game.isActive;
    await game.save();

    res.status(200).json({
      success: true,
      message: `Jogo ${game.isActive ? 'ativado' : 'desativado'} com sucesso`,
      data: { isActive: game.isActive }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao alterar estado do jogo',
      error: error.message
    });
  }
};

// @desc    Eliminar avaliação de um jogo
// @route   DELETE /api/admin/games/:gameId/ratings/:ratingId
// @access  Private/Admin
exports.deleteGameRating = async (req, res) => {
  try {
    const { gameId, ratingId } = req.params;
    const game = await Game.findOne({ rawgId: parseInt(gameId) });

    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Jogo não encontrado'
      });
    }

    game.userRatings = game.userRatings.filter(r => r._id.toString() !== ratingId);
    game.calculateAverageRating();
    await game.save();

    res.status(200).json({
      success: true,
      message: 'Avaliação eliminada com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao eliminar avaliação',
      error: error.message
    });
  }
};

// ============ ESTATÍSTICAS ============

// @desc    Obter estatísticas gerais
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const totalGames = await Game.countDocuments();
    const activeGames = await Game.countDocuments({ isActive: true });
    const totalTransactions = await Transaction.countDocuments();
    const completedTransactions = await Transaction.countDocuments({ status: 'completed' });

    const totalRevenue = await Transaction.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          active: activeUsers,
          inactive: totalUsers - activeUsers
        },
        games: {
          total: totalGames,
          active: activeGames,
          inactive: totalGames - activeGames
        },
        transactions: {
          total: totalTransactions,
          completed: completedTransactions
        },
        revenue: {
          total: totalRevenue.length > 0 ? totalRevenue[0].total : 0
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao obter estatísticas',
      error: error.message
    });
  }
};