const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  rawgId: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true
  },
  description: String,
  released: Date,
  backgroundImage: String,
  rating: Number,
  ratingTop: Number,
  ratingsCount: Number,
  metacritic: Number,
  platforms: [{
    platform: {
      id: Number,
      name: String,
      slug: String
    }
  }],
  genres: [{
    id: Number,
    name: String,
    slug: String
  }],
  publishers: [{
    id: Number,
    name: String,
    slug: String
  }],
  developers: [{
    id: Number,
    name: String,
    slug: String
  }],
  esrbRating: {
    id: Number,
    name: String,
    slug: String
  },
  isExplicit: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  price: {
    amount: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: 'USD'
    },
    onSale: {
      type: Boolean,
      default: false
    },
    salePrice: Number,
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  userRatings: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    comment: {
      type: String,
      maxlength: 1000
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    helpful: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  }],
  averageUserRating: {
    type: Number,
    default: 0
  },
  totalUserRatings: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Índices para melhor performance
gameSchema.index({ rawgId: 1 });
gameSchema.index({ name: 'text' });
gameSchema.index({ isActive: 1, isExplicit: 1 });
gameSchema.index({ 'price.amount': 1 });
gameSchema.index({ averageUserRating: -1 });
gameSchema.index({ released: -1 });

// Método para calcular média de ratings
gameSchema.methods.calculateAverageRating = function() {
  if (this.userRatings.length === 0) {
    this.averageUserRating = 0;
    this.totalUserRatings = 0;
    return;
  }

  const sum = this.userRatings.reduce((acc, rating) => acc + rating.rating, 0);
  this.averageUserRating = (sum / this.userRatings.length).toFixed(2);
  this.totalUserRatings = this.userRatings.length;
};

// Verificar se jogo é explícito baseado no ESRB rating
gameSchema.pre('save', function(next) {
  if (this.esrbRating && (
    this.esrbRating.slug === 'mature' || 
    this.esrbRating.slug === 'adults-only'
  )) {
    this.isExplicit = true;
  }
  next();
});

module.exports = mongoose.model('Game', gameSchema);
