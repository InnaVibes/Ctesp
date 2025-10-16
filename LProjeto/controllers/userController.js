const User = require('../models/User');

// @desc    Obter biblioteca do utilizador
// @route   GET /api/users/library
// @access  Private
exports.getLibrary = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      count: user.library.length,
      data: user.library
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao obter biblioteca',
      error: error.message
    });
  }
};

// @desc    Obter wishlist do utilizador
// @route   GET /api/users/wishlist
// @access  Private
exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      count: user.wishlist.length,
      data: user.wishlist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao obter wishlist',
      error: error.message
    });
  }
};

// @desc    Adicionar jogo à wishlist
// @route   POST /api/users/wishlist
// @access  Private
exports.addToWishlist = async (req, res) => {
  try {
    const { gameId, gameName } = req.body;
    const user = await User.findById(req.user.id);

    // Verificar se já está na wishlist
    const alreadyInWishlist = user.wishlist.some(item => item.gameId === gameId);
    if (alreadyInWishlist) {
      return res.status(400).json({
        success: false,
        message: 'Jogo já está na wishlist'
      });
    }

    // Verificar se já possui o jogo
    const alreadyOwned = user.library.some(item => item.gameId === gameId);
    if (alreadyOwned) {
      return res.status(400).json({
        success: false,
        message: 'Já possui este jogo na biblioteca'
      });
    }

    user.wishlist.push({ gameId, gameName });
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Jogo adicionado à wishlist',
      data: user.wishlist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao adicionar à wishlist',
      error: error.message
    });
  }
};

// @desc    Remover jogo da wishlist
// @route   DELETE /api/users/wishlist/:gameId
// @access  Private
exports.removeFromWishlist = async (req, res) => {
  try {
    const { gameId } = req.params;
    const user = await User.findById(req.user.id);

    user.wishlist = user.wishlist.filter(item => item.gameId !== parseInt(gameId));
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Jogo removido da wishlist',
      data: user.wishlist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao remover da wishlist',
      error: error.message
    });
  }
};

// @desc    Obter carrinho do utilizador
// @route   GET /api/users/cart
// @access  Private
exports.getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const totalAmount = user.cart.reduce((sum, item) => sum + item.price, 0);

    res.status(200).json({
      success: true,
      count: user.cart.length,
      totalAmount: totalAmount.toFixed(2),
      data: user.cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao obter carrinho',
      error: error.message
    });
  }
};

// @desc    Adicionar jogo ao carrinho
// @route   POST /api/users/cart
// @access  Private
exports.addToCart = async (req, res) => {
  try {
    const { gameId, gameName, price } = req.body;
    const user = await User.findById(req.user.id);

    // Verificar se já está no carrinho
    const alreadyInCart = user.cart.some(item => item.gameId === gameId);
    if (alreadyInCart) {
      return res.status(400).json({
        success: false,
        message: 'Jogo já está no carrinho'
      });
    }

    // Verificar se já possui o jogo
    const alreadyOwned = user.library.some(item => item.gameId === gameId);
    if (alreadyOwned) {
      return res.status(400).json({
        success: false,
        message: 'Já possui este jogo na biblioteca'
      });
    }

    user.cart.push({ gameId, gameName, price });
    await user.save();

    const totalAmount = user.cart.reduce((sum, item) => sum + item.price, 0);

    res.status(200).json({
      success: true,
      message: 'Jogo adicionado ao carrinho',
      totalAmount: totalAmount.toFixed(2),
      data: user.cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao adicionar ao carrinho',
      error: error.message
    });
  }
};

// @desc    Remover jogo do carrinho
// @route   DELETE /api/users/cart/:gameId
// @access  Private
exports.removeFromCart = async (req, res) => {
  try {
    const { gameId } = req.params;
    const user = await User.findById(req.user.id);

    user.cart = user.cart.filter(item => item.gameId !== parseInt(gameId));
    await user.save();

    const totalAmount = user.cart.reduce((sum, item) => sum + item.price, 0);

    res.status(200).json({
      success: true,
      message: 'Jogo removido do carrinho',
      totalAmount: totalAmount.toFixed(2),
      data: user.cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao remover do carrinho',
      error: error.message
    });
  }
};

// @desc    Limpar carrinho
// @route   DELETE /api/users/cart
// @access  Private
exports.clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.cart = [];
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Carrinho limpo com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao limpar carrinho',
      error: error.message
    });
  }
};