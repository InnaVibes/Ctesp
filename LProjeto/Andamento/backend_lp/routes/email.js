const express = require("express");
const router = express.Router();

router.post("/welcome", async (req, res) => {
    res.status(200).json({ success: true, message: "Email service placeholder" });
});

router.post("/promotions/broadcast", async (req, res) => {
    res.status(200).json({ success: true, message: "Email service placeholder" });
});

module.exports = router;
