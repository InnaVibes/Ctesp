import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

axios.defaults.baseURL = API_BASE_URL;

// Interceptors para tratamento de erros
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const api = {
  // Serviços
  servicos: {
    getAll: (params) => axios.get('/servicos', { params }),
    getById: (id) => axios.get(`/servicos/${id}`),
    create: (data) => axios.post('/servicos', data),
    update: (id, data) => axios.put(`/servicos/${id}`, data),
    delete: (id) => axios.delete(`/servicos/${id}`),
    confirmar: (id, data) => axios.put(`/servicos/${id}/confirmar`, data),
    getRelatorios: (params) => axios.get('/servicos/relatorios', { params }),
    getHistorico: (veiculoId) => axios.get(`/servicos/historico/${veiculoId}`)
  },

  // Veículos
  veiculos: {
    getAll: (params) => axios.get('/veiculos', { params }),
    getById: (id) => axios.get(`/veiculos/${id}`),
    create: (data) => axios.post('/veiculos', data),
    update: (id, data) => axios.put(`/veiculos/${id}`, data),
    delete: (id) => axios.delete(`/veiculos/${id}`)
  },

  // Usuários
  users: {
    getAll: () => axios.get('/users'),
    getProfile: () => axios.get('/users/profile'),
    updateProfile: (data) => axios.put('/users/profile', data),
    changePassword: (data) => axios.put('/users/change-password', data),
    forgotPassword: (email) => axios.post('/users/forgot-password', { email }),
    resetPassword: (token, password) => axios.post(`/users/reset-password/${token}`, { newPassword: password })
  }
};
