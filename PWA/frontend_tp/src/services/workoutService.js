import api from './api';

// Serviço para operações relacionadas a Planos de Treino
const workoutService = {
  // Listar todos os planos de treino com filtros
  getAll: async (params = {}) => {
    const response = await api.get('/workouts', { params });
    return response.data;
  },

  // Obter detalhes de um plano de treino
  getById: async (id) => {
    const response = await api.get(`/workouts/${id}`);
    return response.data;
  },

  // Criar novo plano de treino (Trainer)
  create: async (workoutData) => {
    const response = await api.post('/workouts', workoutData);
    return response.data;
  },

  // Atualizar plano de treino
  update: async (id, workoutData) => {
    const response = await api.put(`/workouts/${id}`, workoutData);
    return response.data;
  },

  // Deletar plano de treino
  delete: async (id) => {
    const response = await api.delete(`/workouts/${id}`);
    return response.data;
  },

  // Obter planos de treino de um cliente
  getByClient: async (clientId) => {
    const response = await api.get(`/workouts/client/${clientId}`);
    return response.data;
  },

  // Obter planos de treino criados por um trainer
  getByTrainer: async (trainerId) => {
    const response = await api.get(`/workouts/trainer/${trainerId}`);
    return response.data;
  },

  // Registar cumprimento de treino
  logCompletion: async (workoutId, completionData) => {
    const response = await api.post(`/workouts/${workoutId}/complete`, completionData);
    return response.data;
  },

  // Upload de imagem de comprovação de treino
  uploadProof: async (workoutId, imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    const response = await api.post(`/workouts/${workoutId}/upload-proof`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Obter estatísticas de treinos
  getStats: async (clientId, params = {}) => {
    const response = await api.get(`/workouts/stats/${clientId}`, { params });
    return response.data;
  },
};

export default workoutService;
