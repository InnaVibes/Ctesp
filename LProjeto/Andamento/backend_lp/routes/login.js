const express = require("express");
const router = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");

// @desc    Login user (Legacy route)
// @route   POST /login
// @access  Public
router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        error: "Email and password are required" 
      });
    }

    // Find user with password field
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({ 
        success: false,
        error: "Invalid credentials" 
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({ 
        success: false,
        error: "Account deactivated. Contact support." 
      });
    }

    // Use comparePassword method from User model
    const isPasswordCorrect = await user.comparePassword(password);
    
    if (!isPasswordCorrect) {
      return res.status(401).json({ 
        success: false,
        error: "Invalid credentials" 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'chave-secreta',
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.status(200).json({ 
      success: true,
      message: "Login successful", 
      token, 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isAdult: user.isAdult,
        age: user.age
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ 
      success: false,
      error: "Error during login",
      message: err.message 
    });
  }
});

module.exports = router;
