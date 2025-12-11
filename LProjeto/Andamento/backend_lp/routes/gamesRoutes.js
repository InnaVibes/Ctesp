const express = require('express');
const router = express.Router();

router.get('/homepage', (req, res) => {
    res.status(200).json({ success: true, message: "Games homepage placeholder" });
});

router.get('/search', (req, res) => {
    res.status(200).json({ success: true, message: "Games search placeholder" });
});

router.get('/:gameId', (req, res) => {
    res.status(200).json({ success: true, message: "Game details placeholder" });
});

module.exports = router;
