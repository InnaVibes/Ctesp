const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log(`MongoDB Conectado: ${conn.connection.host}`);

    // Criar índices de texto para pesquisa
    const Game = require('../models/Game');
    await Game.collection.createIndex({ name: 'text', description: 'text' });

    console.log('Índices de pesquisa criados com sucesso');
  } catch (error) {
    console.error(`Erro ao conectar à base de dados: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;