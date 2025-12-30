import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import Avatar from '../components/Avatar';
import Loading from '../components/Loading';
import api from '../services/api';
import { toast } from 'react-toastify';

const SelectPT = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [pts, setPts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    loadAvailablePTs();
  }, []);

  const loadAvailablePTs = async () => {
    try {
      const response = await api.get('/users/available-pts');
      setPts(response.data);
    } catch (error) {
      console.error('Erro ao carregar PTs:', error);
      toast.error('Erro ao carregar Personal Trainers');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPT = async (ptId) => {
    setRequesting(true);
    try {
      const response = await api.post('/users/request-pt', { ptId });
      toast.success('Personal Trainer atribuído com sucesso!');
      updateUser({ ptId });
      navigate('/');
    } catch (error) {
      console.error('Erro ao selecionar PT:', error);
      toast.error(error.response?.data?.message || 'Erro ao selecionar PT');
    } finally {
      setRequesting(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Escolher Personal Trainer
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Selecione um Personal Trainer para acompanhar seus treinos
        </p>
      </div>

      {user?.ptId && (
        <Card className="mb-6 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-800">
          <p className="text-blue-800 dark:text-blue-200">
            Você já tem um Personal Trainer atribuído. Escolher outro irá substituir o atual.
          </p>
        </Card>
      )}

      {pts.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Nenhum Personal Trainer disponível no momento
            </p>
            <Button onClick={() => navigate('/')}>Voltar ao Dashboard</Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pts.map((pt) => (
            <Card key={pt._id} className="hover:shadow-lg transition-shadow">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <Avatar
                    src={pt.profileImage}
                    name={pt.username}
                    size="lg"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {pt.username}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  {pt.email}
                </p>
                <Button
                  onClick={() => handleSelectPT(pt._id)}
                  fullWidth
                  disabled={requesting}
                >
                  {user?.ptId?.toString() === pt._id.toString()
                    ? 'PT Atual'
                    : 'Escolher este PT'}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectPT;