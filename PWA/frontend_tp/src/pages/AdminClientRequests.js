import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Loading from '../components/Loading';
import Avatar from '../components/Avatar';
import clientRequestService from '../services/clientRequestService';
import { toast } from 'react-toastify';

const AdminClientRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const response = await clientRequestService.getPendingRequests();
      setRequests(response.data || []);
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
      toast.error('Erro ao carregar pedidos');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    try {
      setActionLoading(true);
      await clientRequestService.approveRequest(requestId);
      toast.success('Pedido aprovado! Cliente atribuído ao PT.');
      setRequests(requests.filter(r => r._id !== requestId));
    } catch (error) {
      console.error('Erro ao aprovar:', error);
      toast.error(error.response?.data?.message || 'Erro ao aprovar pedido');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedRequest) return;

    try {
      setActionLoading(true);
      await clientRequestService.rejectRequest(selectedRequest._id, rejectionReason);
      toast.success('Pedido rejeitado!');
      setRequests(requests.filter(r => r._id !== selectedRequest._id));
      setShowRejectModal(false);
      setRejectionReason('');
      setSelectedRequest(null);
    } catch (error) {
      console.error('Erro ao rejeitar:', error);
      toast.error(error.response?.data?.message || 'Erro ao rejeitar pedido');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Pedidos de Cliente (PT)
      </h1>

      {requests.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="mt-4 text-gray-500 dark:text-gray-400">
              Nenhum pedido pendente no momento
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map(request => (
            <Card key={request._id} hover>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-6 mb-4">
                    {/* PT Info */}
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={request.ptId?.profileImage}
                        name={request.ptId?.username}
                        size="md"
                      />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {request.ptId?.username}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Personal Trainer
                        </p>
                      </div>
                    </div>

                    {/* Seta */}
                    <div className="text-2xl text-gray-400">→</div>

                    {/* Cliente Info */}
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={request.clientId?.profileImage}
                        name={request.clientId?.username}
                        size="md"
                      />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {request.clientId?.username}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Cliente
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    Solicitado em: {new Date(request.requestedAt).toLocaleString('pt-PT')}
                  </p>

                  <div className="p-3 bg-gray-100 dark:bg-gray-900 rounded space-y-2">
                    <div>
                      <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        Email PT:
                      </p>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {request.ptId?.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        Email Cliente:
                      </p>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {request.clientId?.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <Button
                    size="sm"
                    onClick={() => handleApprove(request._id)}
                    disabled={actionLoading}
                    className="whitespace-nowrap"
                  >
                    ✓ Aprovar
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => {
                      setSelectedRequest(request);
                      setShowRejectModal(true);
                    }}
                    disabled={actionLoading}
                    className="whitespace-nowrap"
                  >
                    ✕ Rejeitar
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal para rejeição com motivo */}
      <Modal
        isOpen={showRejectModal}
        onClose={() => {
          setShowRejectModal(false);
          setRejectionReason('');
          setSelectedRequest(null);
        }}
        title="Rejeitar Pedido"
      >
        <div className="space-y-4">
          {selectedRequest && (
            <div className="p-3 bg-gray-100 dark:bg-gray-900 rounded">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>{selectedRequest.ptId?.username}</strong> quer adicionar{' '}
                <strong>{selectedRequest.clientId?.username}</strong> como cliente.
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Motivo da Rejeição (opcional)
            </label>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Por que está rejeitando este pedido?"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
              rows="4"
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant="danger"
              fullWidth
              onClick={handleReject}
              disabled={actionLoading}
            >
              {actionLoading ? 'Rejeitando...' : 'Confirmar Rejeição'}
            </Button>
            <Button
              variant="secondary"
              fullWidth
              onClick={() => {
                setShowRejectModal(false);
                setRejectionReason('');
                setSelectedRequest(null);
              }}
              disabled={actionLoading}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminClientRequests;