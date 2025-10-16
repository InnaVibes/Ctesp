const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  email: {
    type: String,
    required: [true, 'Email é obrigatório'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Email inválido']
  },
  password: {
    type: String,
    required: [true, 'Password é obrigatória'],
    minlength: 6,
    select: false
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Data de nascimento é obrigatória']
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'owner'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  settings: {
    showExplicitContent: {
      type: Boolean,
      default: false
    },
    newsletter: {
      type: Boolean,
      default: false
    }
  },
  library: [{
    gameId: {
      type: Number,
      required: true
    },
    gameName: String,
    purchaseDate: {
      type: Date,
      default: Date.now
    },
    purchasePrice: Number,
    hoursPlayed: {
      type: Number,
      default: 0
    }
  }],
  wishlist: [{
    gameId: {
      type: Number,
      required: true
    },
    gameName: String,
    addedDate: {
      type: Date,
      default: Date.now
    }
  }],
  cart: [{
    gameId: {
      type: Number,
      required: true
    },
    gameName: String,
    price: Number,
    addedDate: {
      type: Date,
      default: Date.now
    }
  }],
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

// Calcular idade
userSchema.virtual('age').get(function() {
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});

// Verificar se é maior de 18
userSchema.virtual('isAdult').get(function() {
  return this.age >= 18;
});

// Encriptar password antes de salvar
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Método para comparar passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Garantir que só existe um owner
userSchema.pre('save', async function(next) {
  if (this.role === 'owner' && this.isNew) {
    const ownerExists = await mongoose.model('User').findOne({ role: 'owner' });
    if (ownerExists && ownerExists._id.toString() !== this._id.toString()) {
      throw new Error('Já existe uma conta Owner no sistema');
    }
  }
  next();
});

// Não permitir alteração do role owner para outro role se for o único owner
userSchema.pre('save', async function(next) {
  if (this.isModified('role') && !this.isNew) {
    const originalUser = await mongoose.model('User').findById(this._id);
    if (originalUser.role === 'owner' && this.role !== 'owner') {
      throw new Error('Não é possível alterar o role da conta Owner');
    }
  }
  next();
});

module.exports = mongoose.model('User', userSchema);