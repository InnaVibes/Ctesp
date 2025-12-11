const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { authenticateToken, isAdminOrOwner } = require("../middleware/auth");

// Create client
router.post("/create", async (req, res) => {
    try {
        const { name, email, password, phone, age, dateOfBirth } = req.body;
        
        if (!name || !email || !password || !phone || !age) {
            return res.status(400).json({ 
                success: false,
                error: "Required fields: name, email, password, phone, age" 
            });
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ 
                success: false,
                error: "Email already registered" 
            });
        }

        // Create user as CLIENT
        const newClient = await User.create({
            name,
            email,
            password, // Will be hashed automatically by pre-save hook
            phone,
            dateOfBirth,
            role: 'client'
        });

        res.status(201).json({ 
            success: true,
            message: "Client created successfully",
            data: {
                id: newClient._id,
                name: newClient.name,
                email: newClient.email,
                role: newClient.role,
                age: newClient.age,
                isAdult: newClient.isAdult
            }
        });

    } catch (err) {
        console.error("Error creating client:", err);
        res.status(500).json({ 
            success: false,
            error: "Error creating client",
            message: err.message 
        });
    }
});

// Get all clients
router.get("/get", authenticateToken, isAdminOrOwner, async (req, res) => {
    try {
        const clients = await User.find({ role: 'client' }).select('-password');
        res.status(200).json({ 
            success: true,
            count: clients.length,
            data: clients 
        });
    } catch (err) {
        console.error("Error fetching clients:", err);
        res.status(500).json({ 
            success: false,
            error: "Error fetching clients" 
        });
    }
});

// Get client by ID
router.get("/get/:id", authenticateToken, async (req, res) => {
    try {
        const client = await User.findById(req.params.id).select('-password');
        
        if (!client || client.role !== 'client') {
            return res.status(404).json({ 
                success: false,
                error: "Client not found" 
            });
        }

        // Check permissions
        if (req.user.role === 'client' && client._id.toString() !== req.user.id) {
            return res.status(403).json({ 
                success: false,
                error: "Access denied" 
            });
        }

        res.status(200).json({ 
            success: true,
            data: client 
        });
    } catch (err) {
        console.error("Error fetching client:", err);
        res.status(500).json({ 
            success: false,
            error: "Error fetching client" 
        });
    }
});

// Update client
router.put("/update/:id", authenticateToken, async (req, res) => {
    try {
        const client = await User.findById(req.params.id);
        
        if (!client || client.role !== 'client') {
            return res.status(404).json({ 
                success: false,
                error: "Client not found" 
            });
        }

        // Check permissions
        if (req.user.role === 'client' && client._id.toString() !== req.user.id) {
            return res.status(403).json({ 
                success: false,
                error: "Access denied" 
            });
        }

        const { name, phone, dateOfBirth } = req.body;
        
        if (name) client.name = name;
        if (phone) client.phone = phone;
        if (dateOfBirth) client.dateOfBirth = dateOfBirth;

        await client.save();

        res.status(200).json({ 
            success: true,
            message: "Client updated successfully",
            data: {
                id: client._id,
                name: client.name,
                email: client.email,
                phone: client.phone,
                age: client.age,
                isAdult: client.isAdult
            }
        });
    } catch (err) {
        console.error("Error updating client:", err);
        res.status(500).json({ 
            success: false,
            error: "Error updating client" 
        });
    }
});

// Delete client
router.delete("/delete/:id", authenticateToken, isAdminOrOwner, async (req, res) => {
    try {
        const client = await User.findById(req.params.id);
        
        if (!client || client.role !== 'client') {
            return res.status(404).json({ 
                success: false,
                error: "Client not found" 
            });
        }

        await User.findByIdAndDelete(req.params.id);

        res.status(200).json({ 
            success: true,
            message: "Client deleted successfully" 
        });
    } catch (err) {
        console.error("Error deleting client:", err);
        res.status(500).json({ 
            success: false,
            error: "Error deleting client" 
        });
    }
});

module.exports = router;
