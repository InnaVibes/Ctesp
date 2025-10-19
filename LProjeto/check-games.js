require('dotenv').config();
const mongoose = require('mongoose');

const check = async () => {
  try {
    console.log('🔗 Conectando a MongoDB...');
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado!\n');
    
    // Definir schema inline para evitar problemas de caminho
    const gameSchema = new mongoose.Schema({}, { strict: false });
    const Game = mongoose.model('Game', gameSchema, 'games');
    
    console.log('📊 Contando jogos...');
    const count = await Game.countDocuments();
    console.log(`✅ Total de jogos: ${count}\n`);
    
    if (count > 0) {
      console.log('📋 Primeiros 5 jogos:\n');
      const games = await Game.find({}).limit(5);
      games.forEach((g, i) => {
        console.log(`${i+1}. ${g.name}`);
        console.log(`   💰 $${g.price?.amount || 'N/A'}`);
        console.log(`   ⭐ ${g.rating || 'N/A'}/5\n`);
      });
    } else {
      console.log('⚠️  Nenhum jogo encontrado!\n');
    }
    
    await mongoose.disconnect();
    console.log('✅ Desconectado');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ ERRO:', error.message);
    process.exit(1);
  }
};

check();