const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  age: { type: Number, required: true },
  dateOfBirth: { type: Date },
  role: { type: String, default: 'client' },
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
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
