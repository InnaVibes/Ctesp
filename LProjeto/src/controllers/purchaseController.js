const User = require('../models/User');
const Game = require('../models/Game');
const Transaction = require('../models/Transaction');

// @desc    Processar compra do carrinho
// @route   POST /api/purchase/checkout
// @access  Private
exports.checkoutCart = async (req, res) => {
  try {
    const { paymentMethod } = req.body;
    const user = await User.findById(req.user.id);

    if (user.cart.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Carrinho está vazio'
      });
    }

    // Calcular total
    const totalAmount = user.cart.reduce((sum, item) => sum + item.price, 0);

    // Criar transação
    const transaction = await Transaction.create({
      userId: user._id,
      items: user.cart.map(item => ({
        gameId: item.gameId,
        gameName: item.gameName,
        price: item.price
      })),
      totalAmount,
      paymentMethod,
      status: 'completed',
      completedAt: Date.now()
    });

    // Adicionar jogos à biblioteca
    for (const item of user.cart) {
      // Verificar se já possui o jogo
      const alreadyOwned = user.library.some(game => game.gameId === item.gameId);
      
      if (!alreadyOwned) {
        user.library.push({
          gameId: item.gameId,
          gameName: item.gameName,
          purchasePrice: item.price,
          purchaseDate: Date.now()
        });

        // Remover da wishlist se existir
        user.wishlist = user.wishlist.filter(w => w.gameId !== item.gameId);
      }
    }

    // Limpar carrinho
    user.cart = [];
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Compra realizada com sucesso',
      data: {
        transaction: {
          id: transaction._id,
          totalAmount: transaction.totalAmount,
          itemsCount: transaction.items.length
        },
        library: user.library
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao processar compra',
      error: error.message
    });
  }
};

// @desc    Comprar jogo individual
// @route   POST /api/purchase/game/:gameId
// @access  Private
exports.purchaseGame = async (req, res) => {
  try {
    const { gameId } = req.params;
    const { paymentMethod } = req.body;
    const user = await User.findById(req.user.id);

    // Verificar se já possui o jogo
    const alreadyOwned = user.library.some(item => item.gameId === parseInt(gameId));
    if (alreadyOwned) {
      return res.status(400).json({
        success: false,
        message: 'Já possui este jogo na biblioteca'
      });
    }

    // Obter informações do jogo
    const game = await Game.findOne({ rawgId: parseInt(gameId) });
    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Jogo não encontrado'
      });
    }

    if (!game.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Jogo não está disponível para compra'
      });
    }

    const price = game.price.onSale ? game.price.salePrice : game.price.amount;

    // Criar transação
    const transaction = await Transaction.create({
      userId: user._id,
      items: [{
        gameId: game.rawgId,
        gameName: game.name,
        price
      }],
      totalAmount: price,
      paymentMethod,
      status: 'completed',
      completedAt: Date.now()
    });

    // Adicionar à biblioteca
    user.library.push({
      gameId: game.rawgId,
      gameName: game.name,
      purchasePrice: price,
      purchaseDate: Date.now()
    });

    // Remover da wishlist se existir
    user.wishlist = user.wishlist.filter(w => w.gameId !== game.rawgId);

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Jogo adquirido com sucesso',
      data: {
        transaction: {
          id: transaction._id,
          totalAmount: transaction.totalAmount
        },
        game: {
          id: game.rawgId,
          name: game.name,
          purchasePrice: price
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao comprar jogo',
      error: error.message
    });
  }
};

// @desc    Obter histórico de transações
// @route   GET /api/purchase/history
// @access  Private
exports.getTransactionHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const transactions = await Transaction.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Transaction.countDocuments({ userId: req.user.id });

    res.status(200).json({
      success: true,
      count: transactions.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: transactions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao obter histórico',
      error: error.message
    });
  }
};

// @desc    Obter detalhes de uma transação
// @route   GET /api/purchase/transaction/:transactionId
// @access  Private
exports.getTransaction = async (req, res) => {
  try {
    const { transactionId } = req.params;

    const transaction = await Transaction.findById(transactionId);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transação não encontrada'
      });
    }

    // Verificar se a transação pertence ao utilizador
    if (transaction.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Sem permissão para aceder a esta transação'
      });
    }

    res.status(200).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao obter transação',
      error: error.message
    });
  }
};