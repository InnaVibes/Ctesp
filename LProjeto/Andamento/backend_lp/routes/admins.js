const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { authenticateToken, isAdminOrOwner } = require("../middleware/auth");

router.post("/create", authenticateToken, isAdminOrOwner, async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
        
        if (!name || !email || !password || !phone) {
            return res.status(400).json({ success: false, error: "Required fields: name, email, password, phone" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ success: false, error: "Email already registered" });
        }

        const newAdmin = await User.create({ name, email, password, phone, role: 'admin' });

        res.status(201).json({ success: true, message: "Admin created successfully", data: { id: newAdmin._id, name: newAdmin.name, email: newAdmin.email, role: newAdmin.role } });
    } catch (err) {
        console.error("Error creating admin:", err);
        res.status(500).json({ success: false, error: "Error creating admin" });
    }
});

router.get("/get", authenticateToken, isAdminOrOwner, async (req, res) => {
    try {
        const admins = await User.find({ role: 'admin' }).select('-password');
        res.status(200).json({ success: true, count: admins.length, data: admins });
    } catch (err) {
        res.status(500).json({ success: false, error: "Error fetching admins" });
    }
});

router.get("/get/:id", authenticateToken, isAdminOrOwner, async (req, res) => {
    try {
        const admin = await User.findById(req.params.id).select('-password');
        if (!admin || admin.role !== 'admin') {
            return res.status(404).json({ success: false, error: "Admin not found" });
        }
        res.status(200).json({ success: true, data: admin });
    } catch (err) {
        res.status(500).json({ success: false, error: "Error fetching admin" });
    }
});

router.put("/update/:id", authenticateToken, isAdminOrOwner, async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        const updateData = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (phone) updateData.phone = phone;

        const adminUpdated = await User.findByIdAndUpdate(req.params.id, updateData, { new: true }).select('-password');
        if (!adminUpdated) {
            return res.status(404).json({ success: false, error: "Admin not found" });
        }
        res.status(200).json({ success: true, message: "Admin updated successfully", data: adminUpdated });
    } catch (err) {
        res.status(500).json({ success: false, error: "Error updating admin" });
    }
});

router.delete("/delete/:id", authenticateToken, isAdminOrOwner, async (req, res) => {
    try {
        const admin = await User.findById(req.params.id);
        if (!admin || admin.role !== 'admin') {
            return res.status(404).json({ success: false, error: "Admin not found" });
        }
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Admin deleted successfully" });
    } catch (err) {
        console.error("Error deleting admin:", err);
        res.status(500).json({ success: false, error: "Error deleting admin" });
    }
});

module.exports = router;
