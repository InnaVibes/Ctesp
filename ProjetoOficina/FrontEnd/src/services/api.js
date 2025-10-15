import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Criar instância do axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 segundos
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token nas requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de erros nas respostas
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Serviços da API organizados
export const apiServices = {
  // Autenticação
  auth: {
    login: (data) => api.post('/auth/login', data),
    register: (data) => api.post('/auth/register', data),
    logout: () => api.post('/auth/logout'),
    getProfile: () => api.get('/auth/profile'),
    updateProfile: (data) => api.put('/auth/profile', data),
    changePassword: (data) => api.put('/auth/change-password', data),
    forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
    resetPassword: (token, newPassword) => api.post(`/auth/reset-password/${token}`, { newPassword }),
    verifyToken: () => api.post('/auth/verify-token'),
  },

  // Serviços
  servicos: {
    getAll: (params) => api.get('/servicos', { params }),
    getById: (id) => api.get(`/servicos/${id}`),
    create: (data) => api.post('/servicos', data),
    update: (id, data) => api.put(`/servicos/${id}`, data),
    delete: (id) => api.delete(`/servicos/${id}`),
    confirmar: (id, data) => api.put(`/servicos/${id}/confirmar`, data),
    getRelatorios: (params) => api.get('/servicos/relatorios', { params }),
    getHistorico: (veiculoId) => api.get(`/servicos/historico/${veiculoId}`)
  },

  // Veículos
  veiculos: {
    getAll: (params) => api.get('/veiculos', { params }),
    getById: (id) => api.get(`/veiculos/${id}`),
    create: (data) => api.post('/veiculos', data),
    update: (id, data) => api.put(`/veiculos/${id}`, data),
    delete: (id) => api.delete(`/veiculos/${id}`)
  },

  // Catálogo
  catalogo: {
    getAll: (params) => api.get('/catalogo', { params }),
    getById: (id) => api.get(`/catalogo/${id}`),
    getCategorias: () => api.get('/catalogo/categorias'),
    getTags: () => api.get('/catalogo/tags'),
    // Admin routes
    admin: {
      getAll: (params) => api.get('/catalogo/admin/todos', { params }),
      create: (data) => api.post('/catalogo/admin', data),
      update: (id, data) => api.put(`/catalogo/admin/${id}`, data),
      delete: (id) => api.delete(`/catalogo/admin/${id}`),
    }
  },
  
  // Favoritos
  favoritos: {
    getAll: () => api.get('/favoritos'),
    add: (catalogoServicoId) => api.post('/favoritos', { catalogoServicoId }),
    remove: (catalogoServicoId) => api.delete(`/favoritos/${catalogoServicoId}`),
  },
  
  // Avaliações
  avaliacoes: {
    create: (data) => api.post('/avaliacoes', data),
    getMinhas: () => api.get('/avaliacoes/minhas'),
    update: (id, data) => api.put(`/avaliacoes/${id}`, data),
    delete: (id) => api.delete(`/avaliacoes/${id}`),
    // Admin routes
    admin: {
      getPendentes: () => api.get('/avaliacoes/admin/pendentes'),
      aprovar: (id) => api.put(`/avaliacoes/admin/${id}/aprovar`),
    }
  },

  // Usuários (para compatibilidade com código existente)
  users: {
    getAll: () => api.get('/auth/admin/users'),
    getProfile: () => api.get('/auth/profile'),
    updateProfile: (data) => api.put('/auth/profile', data),
    changePassword: (data) => api.put('/auth/change-password', data),
    forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
    resetPassword: (token, password) => api.post(`/auth/reset-password/${token}`, { newPassword: password }),
    // Admin routes
    admin: {
      update: (id, data) => api.put(`/auth/admin/users/${id}`, data),
      deactivate: (id) => api.put(`/auth/admin/users/${id}/deactivate`),
    }
  },

  // Upload de arquivos
  upload: {
    single: (file) => {
      const formData = new FormData();
      formData.append('image', file);
      return api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    multiple: (files) => {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('images', file);
      });
      return api.post('/upload/multiple', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
  },

  // Utilitários
  utils: {
    health: () => api.get('/health'),
    docs: () => api.get('/docs'),
  }
};

// Exportar também a instância do axios para uso direto se necessário
export default api;

// Exportar também o objeto api antigo para compatibilidade
export const api_legacy = {
  // Serviços
  servicos: {
    getAll: (params) => api.get('/servicos', { params }),
    getById: (id) => api.get(`/servicos/${id}`),
    create: (data) => api.post('/servicos', data),
    update: (id, data) => api.put(`/servicos/${id}`, data),
    delete: (id) => api.delete(`/servicos/${id}`),
    confirmar: (id, data) => api.put(`/servicos/${id}/confirmar`, data),
    getRelatorios: (params) => api.get('/servicos/relatorios', { params }),
    getHistorico: (veiculoId) => api.get(`/servicos/historico/${veiculoId}`)
  },

  // Veículos
  veiculos: {
    getAll: (params) => api.get('/veiculos', { params }),
    getById: (id) => api.get(`/veiculos/${id}`),
    create: (data) => api.post('/veiculos', data),
    update: (id, data) => api.put(`/veiculos/${id}`, data),
    delete: (id) => api.delete(`/veiculos/${id}`)
  },

  // Usuários
  users: {
    getAll: () => api.get('/users'),
    getProfile: () => api.get('/users/profile'),
    updateProfile: (data) => api.put('/users/profile', data),
    changePassword: (data) => api.put('/users/change-password', data),
    forgotPassword: (email) => api.post('/users/forgot-password', { email }),
    resetPassword: (token, password) => api.post(`/users/reset-password/${token}`, { newPassword: password })
  }
};

// Para compatibilidade, exportar também como 'api'
export { apiServices as api };