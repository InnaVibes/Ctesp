import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/Card';
import Loading from '../components/Loading';
import workoutService from '../services/workoutService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const { user, isTrainer, isClient } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await workoutService.getStats(user._id);
      setStats(data);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm">Treinos Concluídos</p>
            <p className="text-4xl font-bold text-primary-600 dark:text-primary-400 mt-2">
              {stats?.completedWorkouts || 0}
            </p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm">Taxa de Conclusão</p>
            <p className="text-4xl font-bold text-green-600 dark:text-green-400 mt-2">
              {stats?.completionRate || 0}%
            </p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {isTrainer ? 'Total de Clientes' : 'Dias Ativos'}
            </p>
            <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 mt-2">
              {stats?.totalClients || stats?.activeDays || 0}
            </p>
          </div>
        </Card>
      </div>

      <Card title="Progresso Semanal">
        {stats?.weeklyData && (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="workouts" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;
