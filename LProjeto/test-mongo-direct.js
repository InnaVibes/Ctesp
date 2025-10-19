const { MongoClient } = require('mongodb');

console.log('🚀 TESTE DIRETO MONGODB\n');

const uri = 'mongodb://127.0.0.1:27017/game_store';
console.log(`📍 URI: ${uri}\n`);

const client = new MongoClient(uri, { 
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 5000
});

(async () => {
  try {
    console.log('🔗 Conectando...');
    await client.connect();
    console.log('✅ Conectado!\n');
    
    const db = client.db('game_store');
    console.log('✅ BD selecionada\n');
    
    // Listar collections
    console.log('📋 Collections:');
    const collections = await db.listCollections().toArray();
    collections.forEach(c => console.log(`   - ${c.name}`));
    console.log();
    
    // Contar jogos
    const games = db.collection('games');
    const count = await games.countDocuments();
    console.log(`📊 Total de jogos: ${count}\n`);
    
    if (count > 0) {
      console.log('🎮 Primeiros 3 jogos:');
      const items = await games.find({}).limit(3).toArray();
      items.forEach((g, i) => {
        console.log(`\n${i+1}. ${g.name}`);
        console.log(`   ID: ${g.rawgId}`);
        console.log(`   Preço: $${g.price?.amount}`);
        console.log(`   Rating: ${g.rating}/5`);
      });
    }
    
    await client.close();
    console.log('\n✅ Desconectado');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ ERRO:', error.message);
    process.exit(1);
  }
})();