require('dotenv').config();
const mongoose = require('mongoose');

console.log('🚀 INICIANDO SCRIPT DE POPULAÇÃO\n');
console.log('📋 Variáveis de Ambiente:');
console.log(`   MONGODB_URI: ${process.env.MONGODB_URI}`);
console.log(`   RAWG_API_KEY: ${process.env.RAWG_API_KEY ? '✅ Configurada' : '❌ NÃO CONFIGURADA'}`);
console.log(`   NODE_ENV: ${process.env.NODE_ENV}\n`);

const Game = require('../models/Game');
const rawgService = require('../services/rawgService');
const cheapSharkService = require('../services/cheapSharkService');

const populateGames = async () => {
  try {
    console.log('🔗 Conectando à base de dados...');
    console.log(`   URL: ${process.env.MONGODB_URI}\n`);
    
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('✅ Conectado à base de dados com sucesso!\n');

    // Verificar se já existem jogos
    console.log('📊 Verificando jogos existentes...');
    const gameCount = await Game.countDocuments();
    console.log(`   Jogos na BD: ${gameCount}\n`);

    if (gameCount > 0) {
      console.log('⚠️  Já existem jogos na BD. Abortando...\n');
      process.exit(0);
    }

    console.log('🎮 Começando a buscar jogos da RAWG API...\n');

    // IDs de jogos populares
    const gameIds = [
      3498,    // Grand Theft Auto V
      3328,    // The Witcher 3: Wild Hunt
      4200,    // Portal 2
      5286,    // Tomb Raider (2013)
      12020,   // Left 4 Dead 2
      13536,   // Portal
      4291,    // Counter-Strike: Global Offensive
      5679,    // The Elder Scrolls V: Skyrim
      802,     // Borderlands 2
      28       // Red Dead Redemption 2
    ];

    let successCount = 0;
    let errorCount = 0;

    for (const gameId of gameIds) {
      try {
        console.log(`📥 Buscando jogo ID: ${gameId}...`);

        // Teste a conexão com RAWG
        console.log(`   Chamando RAWG API...`);
        const rawgGame = await rawgService.getGameDetails(gameId);

        if (!rawgGame) {
          console.error(`   ❌ Jogo ${gameId} não encontrado na RAWG\n`);
          errorCount++;
          continue;
        }

        console.log(`   ✅ Encontrado: ${rawgGame.name}`);

        // Verificar se já existe
        const existingGame = await Game.findOne({ rawgId: gameId });
        if (existingGame) {
          console.log(`   ⏭️  Jogo já existe. Pulando...\n`);
          continue;
        }

        // Buscar preço
        let priceData = null;
        try {
          console.log(`   💰 Buscando preço em CheapShark...`);
          priceData = await cheapSharkService.searchGamePrice(rawgGame.name);
          if (priceData) {
            console.log(`   ✅ Preço encontrado: $${priceData.price}`);
          } else {
            console.log(`   💾 Usando preço fallback`);
          }
        } catch (err) {
          console.log(`   ⚠️  Erro CheapShark (continuando com fallback): ${err.message}`);
        }

        const releaseYear = rawgGame.released 
          ? new Date(rawgGame.released).getFullYear() 
          : new Date().getFullYear();

        const price = priceData 
          ? priceData.price 
          : cheapSharkService.generateFallbackPrice(rawgGame.rating || 3, releaseYear);

        // Verificar se é explícito
        const isExplicit = rawgGame.esrb_rating && 
          (rawgGame.esrb_rating.slug === 'mature' || 
           rawgGame.esrb_rating.slug === 'adults-only');

        console.log(`   📝 Criando registo na BD...`);

        // Criar jogo
        const game = await Game.create({
          rawgId: rawgGame.id,
          name: rawgGame.name,
          slug: rawgGame.slug,
          description: rawgGame.description_raw || rawgGame.description || '',
          released: rawgGame.released,
          backgroundImage: rawgGame.background_image,
          rating: rawgGame.rating || 0,
          ratingTop: rawgGame.rating_top || 0,
          ratingsCount: rawgGame.ratings_count || 0,
          metacritic: rawgGame.metacritic || 0,
          platforms: rawgGame.platforms || [],
          genres: rawgGame.genres || [],
          publishers: rawgGame.publishers || [],
          developers: rawgGame.developers || [],
          esrbRating: rawgGame.esrb_rating || null,
          isExplicit: isExplicit,
          isActive: true,
          price: {
            amount: price,
            currency: 'USD',
            onSale: priceData ? priceData.onSale : false,
            salePrice: priceData && priceData.onSale ? priceData.price : null
          }
        });

        console.log(`✅ ${game.name} criado com sucesso!`);
        console.log(`   - ID: ${game.rawgId}`);
        console.log(`   - Preço: $${game.price.amount}`);
        console.log(`   - Rating: ${game.rating}/5`);
        console.log(`   - Explícito: ${isExplicit ? 'Sim' : 'Não'}\n`);

        successCount++;

        // Delay para não sobrecarregar
        console.log('   ⏳ Aguardando 1 segundo...\n');
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        console.error(`❌ Erro ao processar jogo ${gameId}:`);
        console.error(`   ${error.message}\n`);
        errorCount++;
      }
    }

    console.log('\n╔════════════════════════════════════╗');
    console.log('║    POPULAÇÃO CONCLUÍDA             ║');
    console.log(`║    ✅ Sucesso: ${successCount.toString().padEnd(21)} ║`);
    console.log(`║    ❌ Erros: ${errorCount.toString().padEnd(23)} ║`);
    console.log('╚════════════════════════════════════╝\n');

    // Verificar resultado
    const finalCount = await Game.countDocuments();
    console.log(`📊 Total de jogos na BD: ${finalCount}\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ ERRO CRÍTICO ao popular jogos:');
    console.error(`   ${error.message}`);
    console.error(`   ${error.stack}\n`);
    process.exit(1);
  }
};

populateGames();