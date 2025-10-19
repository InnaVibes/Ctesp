const axios = require('axios');

class CheapSharkService {
  constructor() {
    this.baseURL = process.env.CHEAPSHARK_BASE_URL || 'https://www.cheapshark.com/api/1.0';
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000
    });
  }

  // Pesquisar jogo por título para obter preços
  async searchGamePrice(gameTitle) {
    try {
      const response = await this.client.get('/games', {
        params: {
          title: gameTitle,
          limit: 1
        }
      });

      if (response.data && response.data.length > 0) {
        const game = response.data[0];
        return {
          gameId: game.gameID,
          name: game.external,
          price: parseFloat(game.cheapest),
          retailPrice: parseFloat(game.normal) || parseFloat(game.cheapest),
          onSale: parseFloat(game.cheapest) < parseFloat(game.normal),
          savings: game.savings || '0'
        };
      }

      return null;
    } catch (error) {
      console.error(`Erro ao buscar preço para ${gameTitle}:`, error.message);
      return null;
    }
  }

  // Obter detalhes de uma deal específica
  async getDealDetails(dealId) {
    try {
      const response = await this.client.get('/deals', {
        params: { id: dealId }
      });
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar deal ${dealId}:`, error.message);
      return null;
    }
  }

  // Obter múltiplos preços de jogos
  async getMultipleGamePrices(gameTitles) {
    try {
      const pricePromises = gameTitles.map(title => this.searchGamePrice(title));
      const prices = await Promise.all(pricePromises);
      return prices.filter(price => price !== null);
    } catch (error) {
      console.error('Erro ao buscar múltiplos preços:', error.message);
      return [];
    }
  }

  // Obter deals em destaque
  async getFeaturedDeals() {
    try {
      const response = await this.client.get('/deals', {
        params: {
          sortBy: 'Savings',
          pageSize: 10
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar deals em destaque:', error.message);
      return [];
    }
  }

  // Gerar preço aleatório para jogos sem preço na CheapShark
  generateFallbackPrice(gameRating, releaseYear) {
    const currentYear = new Date().getFullYear();
    const yearDiff = currentYear - releaseYear;
    
    let basePrice = 59.99;
    
    // Reduzir preço baseado na idade do jogo
    if (yearDiff > 5) basePrice = 19.99;
    else if (yearDiff > 3) basePrice = 29.99;
    else if (yearDiff > 1) basePrice = 39.99;
    
    // Ajustar baseado no rating
    if (gameRating >= 4.5) basePrice *= 1.2;
    else if (gameRating < 3) basePrice *= 0.7;
    
    return parseFloat(basePrice.toFixed(2));
  }
}

module.exports = new CheapSharkService();