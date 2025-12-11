const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { authenticateToken, isOwner } = require("../middleware/auth");

router.post("/create", async (req, res) => {
    try {
        const existingOwner = await User.find({ role: 'owner' });
        if (existingOwner.length > 0 && (!req.user || req.user.role !== "owner")) {
            return res.status(403).json({ success: false, error: "Only owner can create another owner" });
        }
        const { name, email, password, phone } = req.body;
        if (!name || !email || !password || !phone) {
            return res.status(400).json({ success: false, error: "Required fields: name, email, password, phone" });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ success: false, error: "Email already registered" });
        }
        const newOwner = await User.create({ name, email, password, phone, role: "owner" });
        res.status(201).json({ success: true, message: "Owner created successfully", data: { id: newOwner._id, name: newOwner.name, email: newOwner.email, role: newOwner.role } });
    } catch (err) {
        console.error("Error creating owner:", err);
        res.status(500).json({ success: false, error: "Error creating owner" });
    }
});

router.get("/get", authenticateToken, isOwner, async (req, res) => {
    try {
        const owners = await User.find({ role: 'owner' }).select('-password');
        res.status(200).json({ success: true, count: owners.length, data: owners });
    } catch (err) {
        res.status(500).json({ success: false, error: "Error fetching owner" });
    }
});

router.get("/get/:id", authenticateToken, isOwner, async (req, res) => {
    try {
        const owner = await User.findById(req.params.id).select('-password');
        if (!owner || owner.role !== 'owner') {
            return res.status(404).json({ success: false, error: "Owner not found" });
        }
        res.status(200).json({ success: true, data: owner });
    } catch (err) {
        res.status(500).json({ success: false, error: "Error fetching owner" });
    }
});

router.put("/update/:id", authenticateToken, isOwner, async (req, res) => {
    try {
        const { name, phone } = req.body;
        const updateData = {};
        if (name) updateData.name = name;
        if (phone) updateData.phone = phone;
        const ownerUpdated = await User.findByIdAndUpdate(req.params.id, updateData, { new: true }).select('-password');
        if (!ownerUpdated) {
            return res.status(404).json({ success: false, error: "Owner not found" });
        }
        res.status(200).json({ success: true, message: "Owner updated successfully", data: ownerUpdated });
    } catch (err) {
        res.status(500).json({ success: false, error: "Error updating owner" });
    }
});

router.delete("/delete/:id", authenticateToken, isOwner, async (req, res) => {
    try {
        const owner = await User.findById(req.params.id);
        if (!owner || owner.role !== 'owner') {
            return res.status(404).json({ success: false, error: "Owner not found" });
        }
        const allOwners = await User.find({ role: 'owner' });
        if (allOwners.length <= 1) {
            return res.status(400).json({ success: false, error: "Cannot delete the only owner" });
        }
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Owner deleted successfully" });
    } catch (err) {
        console.error("Error deleting owner:", err);
        res.status(500).json({ success: false, error: "Error deleting owner" });
    }
});

module.exports = router;
