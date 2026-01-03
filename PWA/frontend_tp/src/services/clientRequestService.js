import api from './api';

const clientRequestService = {
  // PT pede um cliente
  requestClient: async (clientId) => {
    const response = await api.post('/users/request-client', { clientId });
    return response.data;
  },

  // PT vê seus pedidos
  getMyRequests: async () => {
    const response = await api.get('/users/my-client-requests');
    return response.data;
  },

  // ADMIN vê todos os pedidos pendentes
  getPendingRequests: async () => {
    const response = await api.get('/admin/client-requests');
    return response.data;
  },

  // ADMIN aprova um pedido
  approveRequest: async (requestId) => {
    const response = await api.put(`/admin/client-requests/${requestId}`, {
      status: 'approved'
    });
    return response.data;
  },

  // ADMIN rejeita um pedido
  rejectRequest: async (requestId, rejectionReason) => {
    const response = await api.put(`/admin/client-requests/${requestId}`, {
      status: 'rejected',
      rejectionReason
    });
    return response.data;
  }
};

export default clientRequestService;