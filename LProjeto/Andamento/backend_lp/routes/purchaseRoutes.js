const express = require('express');
const router = express.Router();

router.post('/checkout', (req, res) => {
    res.status(200).json({ success: true, message: "Purchase placeholder" });
});

router.post('/game/:gameId', (req, res) => {
    res.status(200).json({ success: true, message: "Purchase game placeholder" });
});

router.get('/history', (req, res) => {
    res.status(200).json({ success: true, message: "Purchase history placeholder" });
});

module.exports = router;
