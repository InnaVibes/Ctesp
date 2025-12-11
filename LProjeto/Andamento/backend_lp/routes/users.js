const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { protect, clientOnly } = require('../middleware/auth');

router.get('/library', protect, clientOnly, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({ success: true, count: user.library.length, data: user.library });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching library', error: error.message });
    }
});

router.get('/wishlist', protect, clientOnly, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({ success: true, count: user.wishlist.length, data: user.wishlist });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching wishlist', error: error.message });
    }
});

router.post('/wishlist', protect, clientOnly, async (req, res) => {
    try {
        const { gameId, gameName } = req.body;
        const user = await User.findById(req.user.id);
        if (user.wishlist.some(item => item.gameId === gameId)) {
            return res.status(400).json({ success: false, message: 'Game already in wishlist' });
        }
        if (user.library.some(item => item.gameId === gameId)) {
            return res.status(400).json({ success: false, message: 'You already own this game' });
        }
        user.wishlist.push({ gameId, gameName });
        await user.save();
        res.status(200).json({ success: true, message: 'Game added to wishlist', data: user.wishlist });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error adding to wishlist', error: error.message });
    }
});

router.delete('/wishlist/:gameId', protect, clientOnly, async (req, res) => {
    try {
        const { gameId } = req.params;
        const user = await User.findById(req.user.id);
        user.wishlist = user.wishlist.filter(item => item.gameId !== parseInt(gameId));
        await user.save();
        res.status(200).json({ success: true, message: 'Game removed from wishlist', data: user.wishlist });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error removing from wishlist', error: error.message });
    }
});

router.get('/cart', protect, clientOnly, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const totalPrice = user.cart.reduce((sum, item) => sum + (item.price || 0), 0);
        res.status(200).json({ success: true, count: user.cart.length, totalPrice, data: user.cart });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching cart', error: error.message });
    }
});

router.post('/cart', protect, clientOnly, async (req, res) => {
    try {
        const { gameId, gameName, price } = req.body;
        const user = await User.findById(req.user.id);
        if (user.library.some(item => item.gameId === gameId)) {
            return res.status(400).json({ success: false, message: 'You already own this game' });
        }
        if (user.cart.some(item => item.gameId === gameId)) {
            return res.status(400).json({ success: false, message: 'Game already in cart' });
        }
        user.cart.push({ gameId, gameName, price });
        await user.save();
        res.status(200).json({ success: true, message: 'Game added to cart', data: user.cart });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error adding to cart', error: error.message });
    }
});

router.delete('/cart/:gameId', protect, clientOnly, async (req, res) => {
    try {
        const { gameId } = req.params;
        const user = await User.findById(req.user.id);
        user.cart = user.cart.filter(item => item.gameId !== parseInt(gameId));
        await user.save();
        res.status(200).json({ success: true, message: 'Game removed from cart', data: user.cart });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error removing from cart', error: error.message });
    }
});

router.delete('/cart', protect, clientOnly, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.cart = [];
        await user.save();
        res.status(200).json({ success: true, message: 'Cart cleared', data: [] });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error clearing cart', error: error.message });
    }
});

module.exports = router;
