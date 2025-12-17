import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Loading from '../components/Loading';
import { toast } from 'react-toastify';
import trainerService from '../services/trainerService';
import clientService from '../services/clientService';

const Admin = () => {
  const [trainers, setTrainers] = useState([]);
  const [trainerRequests, setTrainerRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('trainers');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const trainersData = await trainerService.getAll();
      const requestsData = await clientService.getTrainerChangeRequests();
      setTrainers(trainersData);
      setTrainerRequests(requestsData);
    } catch (error) {
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleValidateTrainer = async (trainerId) => {
    try {
      await trainerService.validate(trainerId);
      toast.success('Personal trainer validado com sucesso');
      loadData();
    } catch (error) {
      toast.error('Erro ao validar personal trainer');
    }
  };

  const handleDeleteTrainer = async (trainerId) => {
    if (window.confirm('Tem certeza que deseja eliminar este personal trainer?')) {
      try {
        await trainerService.delete(trainerId);
        toast.success('Personal trainer eliminado');
        loadData();
      } catch (error) {
        toast.error('Erro ao eliminar personal trainer');
      }
    }
  };

  const handleApproveRequest = async (requestId) => {
    try {
      await clientService.approveTrainerChange(requestId);
      toast.success('Pedido aprovado');
      loadData();
    } catch (error) {
      toast.error('Erro ao aprovar pedido');
    }
  };

  const handleRejectRequest = async (requestId) => {
    const reason = prompt('Motivo da rejeição:');
    if (!reason) return;

    try {
      await clientService.rejectTrainerChange(requestId, reason);
      toast.success('Pedido rejeitado');
      loadData();
    } catch (error) {
      toast.error('Erro ao rejeitar pedido');
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Painel de Administração
      </h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b dark:border-gray-700">
        <button
          onClick={() => setActiveTab('trainers')}
          className={`
            px-4 py-2 font-medium transition-colors
            ${activeTab === 'trainers'
              ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }
          `}
        >
          Personal Trainers
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`
            px-4 py-2 font-medium transition-colors relative
            ${activeTab === 'requests'
              ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }
          `}
        >
          Pedidos de Mudança
          {trainerRequests.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
              {trainerRequests.length}
            </span>
          )}
        </button>
      </div>

      {/* Conteúdo das tabs */}
      {activeTab === 'trainers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trainers.map(trainer => (
            <Card key={trainer._id}>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {trainer.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {trainer.email}
              </p>
              <div className="flex items-center gap-2 mb-4">
                <span
                  className={`
                    px-2 py-1 text-xs rounded-full
                    ${trainer.validated
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }
                  `}
                >
                  {trainer.validated ? 'Validado' : 'Pendente'}
                </span>
              </div>
              <div className="flex gap-2">
                {!trainer.validated && (
                  <Button
                    size="sm"
                    variant="success"
                    onClick={() => handleValidateTrainer(trainer._id)}
                  >
                    Validar
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDeleteTrainer(trainer._id)}
                >
                  Eliminar
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'requests' && (
        <div className="space-y-4">
          {trainerRequests.map(request => (
            <Card key={request._id}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {request.clientName}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Treinador Atual: {request.currentTrainerName}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Novo Treinador: {request.newTrainerName}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    Motivo: {request.reason}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="success"
                    onClick={() => handleApproveRequest(request._id)}
                  >
                    Aprovar
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleRejectRequest(request._id)}
                  >
                    Rejeitar
                  </Button>
                </div>
              </div>
            </Card>
          ))}
          {trainerRequests.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                Nenhum pedido pendente
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Admin;
