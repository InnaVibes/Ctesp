const axios = require('axios');

class RawgService {
  constructor() {
    this.baseURL = process.env.RAWG_BASE_URL || 'https://api.rawg.io/api';
    this.apiKey = process.env.RAWG_API_KEY;
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000
    });
  }

  // Obter lista de jogos com filtros
  async getGames(params = {}) {
    try {
      const response = await this.client.get('/games', {
        params: {
          key: this.apiKey,
          page: params.page || 1,
          page_size: params.pageSize || 20,
          search: params.search,
          ordering: params.ordering || '-released',
          genres: params.genres,
          platforms: params.platforms,
          dates: params.dates
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar jogos da RAWG:', error.message);
      throw new Error('Erro ao comunicar com a API RAWG');
    }
  }

  // Obter detalhes de um jogo específico
  async getGameDetails(gameId) {
    try {
      const response = await this.client.get(`/games/${gameId}`, {
        params: { key: this.apiKey }
      });
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar detalhes do jogo ${gameId}:`, error.message);
      throw new Error('Erro ao obter detalhes do jogo');
    }
  }

  // Obter screenshots de um jogo
  async getGameScreenshots(gameId) {
    try {
      const response = await this.client.get(`/games/${gameId}/screenshots`, {
        params: { key: this.apiKey }
      });
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar screenshots do jogo ${gameId}:`, error.message);
      return { results: [] };
    }
  }

  // Obter jogos em destaque (altamente avaliados)
  async getFeaturedGames() {
    try {
      const response = await this.client.get('/games', {
        params: {
          key: this.apiKey,
          page_size: 10,
          ordering: '-rating',
          metacritic: '80,100'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar jogos em destaque:', error.message);
      throw new Error('Erro ao obter jogos em destaque');
    }
  }

  // Obter jogos mais recentes
  async getRecentGames() {
    try {
      const today = new Date();
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(today.getMonth() - 3);

      const response = await this.client.get('/games', {
        params: {
          key: this.apiKey,
          page_size: 10,
          ordering: '-released',
          dates: `${threeMonthsAgo.toISOString().split('T')[0]},${today.toISOString().split('T')[0]}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar jogos recentes:', error.message);
      throw new Error('Erro ao obter jogos recentes');
    }
  }

  // Obter jogos mais populares (por número de adições)
  async getPopularGames() {
    try {
      const response = await this.client.get('/games', {
        params: {
          key: this.apiKey,
          page_size: 10,
          ordering: '-added'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar jogos populares:', error.message);
      throw new Error('Erro ao obter jogos populares');
    }
  }

  // Pesquisar jogos por nome
  async searchGames(searchTerm, page = 1, pageSize = 20) {
    try {
      const response = await this.client.get('/games', {
        params: {
          key: this.apiKey,
          search: searchTerm,
          page: page,
          page_size: pageSize
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao pesquisar jogos:', error.message);
      throw new Error('Erro ao pesquisar jogos');
    }
  }

  // Obter géneros disponíveis
  async getGenres() {
    try {
      const response = await this.client.get('/genres', {
        params: { key: this.apiKey }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar géneros:', error.message);
      return { results: [] };
    }
  }

  // Obter plataformas disponíveis
  async getPlatforms() {
    try {
      const response = await this.client.get('/platforms', {
        params: { key: this.apiKey }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar plataformas:', error.message);
      return { results: [] };
    }
  }
}

module.exports = new RawgService();