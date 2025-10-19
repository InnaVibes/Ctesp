require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const createOwner = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conectado à base de dados');

    // Verificar se já existe um owner
    const ownerExists = await User.findOne({ role: 'owner' });
    
    if (ownerExists) {
      console.log('Conta Owner já existe!');
      console.log(`Email: ${ownerExists.email}`);
      process.exit(0);
    }

    // Criar conta owner
    const owner = await User.create({
      name: process.env.OWNER_NAME || 'Owner',
      email: process.env.OWNER_EMAIL || 'owner@gamestore.com',
      password: process.env.OWNER_PASSWORD || 'Owner123!',
      dateOfBirth: new Date('1990-01-01'),
      role: 'owner',
      isActive: true
    });

    console.log('Conta Owner criada com sucesso!');
    console.log(`Nome: ${owner.name}`);
    console.log(`Email: ${owner.email}`);
    console.log(`ID: ${owner._id}`);
    console.log('\nIMPORTANTE: Altere a password no primeiro login!');

    process.exit(0);
  } catch (error) {
    console.error('Erro ao criar Owner:', error.message);
    process.exit(1);
  }
};

createOwner();