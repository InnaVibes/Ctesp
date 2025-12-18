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

  getByTrainer: async (trainerId) => {
    try {
      const response = await api.get('/plans', { 
        params: { ptId: trainerId } 
      });
      return response.data || [];
    } catch (error) {
      console.error('Erro ao buscar planos do trainer:', error);
      return [];
    }
  },

  logCompletion: async (workoutId, completionData) => {
    const response = await api.post(`/plans/${workoutId}/complete`, completionData);
    return response.data;
  },

  uploadProof: async (workoutId, imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('status', 'completed');
    
    const response = await api.post(`/plans/${workoutId}/complete`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getStats: async (clientId, params = {}) => {
    try {
      const plans = await workoutService.getByClient(clientId);
      
      const completedWorkouts = plans.filter(p => p.isCompleted).length;
      const totalWorkouts = plans.length;
      const completionRate = totalWorkouts > 0 
        ? Math.round((completedWorkouts / totalWorkouts) * 100) 
        : 0;
      
      const weeklyData = [
        { day: 'Seg', workouts: 2 },
        { day: 'Ter', workouts: 1 },
        { day: 'Qua', workouts: 3 },
        { day: 'Qui', workouts: 2 },
        { day: 'Sex', workouts: 1 },
        { day: 'Sáb', workouts: 0 },
        { day: 'Dom', workouts: 1 },
      ];
      
      return {
        completedWorkouts,
        completionRate,
        activeDays: 5,
        totalClients: 10,
        weeklyData
      };
    } catch (error) {
      console.error('Erro ao calcular stats:', error);
      return {
        completedWorkouts: 0,
        completionRate: 0,
        activeDays: 0,
        totalClients: 0,
        weeklyData: []
      };
    }
  },
};

export default workoutService;