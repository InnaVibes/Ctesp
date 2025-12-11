const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({ 
    name: { type: String, required: true },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        lowercase: true,
        trim: true
    },
    password: { 
        type: String, 
        required: true, 
        select: false,
        minlength: 8
    },
    phone: { type: String },
    dateOfBirth: { type: Date },
    role: { 
        type: String, 
        enum: ['admin', 'client', 'owner'], 
        required: true,
        default: 'client'
    },
    isActive: { type: Boolean, default: true },
    settings: {
        showExplicitContent: { type: Boolean, default: false },
        newsletter: { type: Boolean, default: false }
    },
    library: [{
        gameId: { type: Number, required: true },
        gameName: String,
        purchaseDate: { type: Date, default: Date.now },
        purchasePrice: Number,
        hoursPlayed: { type: Number, default: 0 }
    }],
    wishlist: [{
        gameId: { type: Number, required: true },
        gameName: String,
        addedDate: { type: Date, default: Date.now }
    }],
    cart: [{
        gameId: { type: Number, required: true },
        gameName: String,
        price: Number,
        addedDate: { type: Date, default: Date.now }
    }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { 
    timestamps: true 
});

// Virtual para calcular idade
userSchema.virtual('age').get(function() {
    if (!this.dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
});

// Virtual para verificar se é adulto (18+)
userSchema.virtual('isAdult').get(function() {
    const age = this.age;
    return age !== null && age >= 18;
});

// Hash password antes de salvar
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Método para comparar passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw error;
    }
};

// Incluir virtuals em JSON e Object
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
