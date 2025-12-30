import api from './api';

const workoutService = {
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/plans', { params });
      return response.data || [];
    } catch (error) {
      console.error('Erro ao buscar planos:', error);
      return [];
    }
  },

  getById: async (id) => {
    const response = await api.get(`/plans/${id}`);
    return response.data;
  },

  create: async (workoutData) => {
    const response = await api.post('/plans', workoutData);
    return response.data;
  },

  update: async (id, workoutData) => {
    const response = await api.put(`/plans/${id}`, workoutData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/plans/${id}`);
    return response.data;
  },

  getByClient: async (clientId) => {
    try {
      const response = await api.get('/plans', { 
        params: { clientId } 
      });
      return response.data || [];
    } catch (error) {
      console.error('Erro ao buscar planos do cliente:', error);
      return [];
    }
  },

  // Método para completar treino com imagem
  completeWorkout: async (planId, formData) => {
    const response = await api.post(`/plans/${planId}/complete`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Obter estatísticas do dashboard
  getStats: async (clientId) => {
    try {
      const params = clientId ? { clientId } : {};
      const response = await api.get('/plans/stats', { params });
      
      // Transformar dados para o formato esperado pelo gráfico
      const weeklyData = response.data.map(item => ({
        day: item.date,
        workouts: item.totalCompleted
      }));
      
      const totalCompleted = weeklyData.reduce((sum, item) => sum + item.workouts, 0);
      
      return {
        completedWorkouts: totalCompleted,
        completionRate: 75, // Calcular baseado nos dados reais
        activeDays: weeklyData.filter(item => item.workouts > 0).length,
        weeklyData
      };
    } catch (error) {
      console.error('Erro ao calcular stats:', error);
      return {
        completedWorkouts: 0,
        completionRate: 0,
        activeDays: 0,
        weeklyData: []
      };
    }
  },
};

export default workoutService;