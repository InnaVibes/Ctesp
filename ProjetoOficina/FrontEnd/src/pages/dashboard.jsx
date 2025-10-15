import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { Car, Settings, Users, Calendar } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    veiculos: 0,
    servicos: 0,
    servicosPendentes: 0,
    proximosServicos: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [veiculosRes, servicosRes] = await Promise.all([
        api.veiculos.getAll(),
        api.servicos.getAll()
      ]);

      const servicos = servicosRes.data.servicos || servicosRes.data;
      const veiculos = veiculosRes.data;

      setStats({
        veiculos: veiculos.length,
        servicos: servicos.length,
        servicosPendentes: servicos.filter(s => s.status === 'pending_confirmation').length,
        proximosServicos: servicos
          .filter(s => ['confirmed', 'in_progress'].includes(s.status))
          .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate))
          .slice(0, 5)
      });
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const statsCards = [
    {
      name: 'Meus Veículos',
      value: stats.veiculos,
      icon: Car,
      color: 'bg-blue-500'
    },
    {
      name: 'Total de Serviços',
      value: stats.servicos,
      icon: Settings,
      color: 'bg-green-500'
    },
    {
      name: 'Pendentes de Confirmação',
      value: stats.servicosPendentes,
      icon: Calendar,
      color: 'bg-yellow-500'
    }
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Bem-vindo, {user?.name}!
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Aqui está um resumo da sua conta
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`${stat.color} rounded-md p-3`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.name}
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stat.value}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Próximos Serviços */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Próximos Serviços
          </h3>
          
          {stats.proximosServicos.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              Nenhum serviço agendado
            </p>
          ) : (
            <div className="space-y-3">
              {stats.proximosServicos.map((servico) => (
                <div key={servico._id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{servico.type}</p>
                    <p className="text-sm text-gray-500">
                      {servico.veiculoId?.make} {servico.veiculoId?.model} - {servico.veiculoId?.licensePlate}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(servico.scheduledDate).toLocaleDateString('pt-BR')}
                    </p>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      servico.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      servico.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {servico.status === 'confirmed' ? 'Confirmado' :
                       servico.status === 'in_progress' ? 'Em Andamento' :
                       'Pendente'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;