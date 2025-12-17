import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Loading from '../components/Loading';
import Modal from '../components/Modal';
import Input from '../components/Input';
import workoutService from '../services/workoutService';
import { toast } from 'react-toastify';

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentWorkout, setCurrentWorkout] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = async () => {
    try {
      const data = await workoutService.getAll();
      setWorkouts(data);
    } catch (error) {
      toast.error('Erro ao carregar treinos');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWorkout = () => {
    setCurrentWorkout(null);
    setShowModal(true);
  };

  const handleEditWorkout = (workout) => {
    setCurrentWorkout(workout);
    setShowModal(true);
  };

  const handleDeleteWorkout = async (id) => {
    if (window.confirm('Tem certeza que deseja eliminar este treino?')) {
      try {
        await workoutService.delete(id);
        toast.success('Treino eliminado com sucesso');
        loadWorkouts();
      } catch (error) {
        toast.error('Erro ao eliminar treino');
      }
    }
  };

  const filteredWorkouts = workouts
    .filter(w => 
      w.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.title?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'client') return a.clientName?.localeCompare(b.clientName);
      return 0;
    });

  if (loading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Planos de Treino
        </h1>
        <Button onClick={handleCreateWorkout}>
          + Novo Plano
        </Button>
      </div>

      {/* Filtros e pesquisa */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Pesquisar por cliente ou título..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option value="date">Ordenar por Data</option>
          <option value="client">Ordenar por Cliente</option>
        </select>
      </div>

      {/* Lista de treinos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWorkouts.map(workout => (
          <Card key={workout._id} hover>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {workout.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Cliente: {workout.clientName}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
              {workout.weeklyFrequency}x por semana
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => handleEditWorkout(workout)}
              >
                Editar
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={() => handleDeleteWorkout(workout._id)}
              >
                Eliminar
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredWorkouts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            Nenhum plano de treino encontrado
          </p>
        </div>
      )}

      {/* Modal de criação/edição */}
      <WorkoutModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        workout={currentWorkout}
        onSave={loadWorkouts}
      />
    </div>
  );
};

// Componente Modal para criar/editar treino
const WorkoutModal = ({ isOpen, onClose, workout, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    clientId: '',
    weeklyFrequency: 3,
    exercises: [],
  });

  useEffect(() => {
    if (workout) {
      setFormData(workout);
    }
  }, [workout]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (workout) {
        await workoutService.update(workout._id, formData);
        toast.success('Treino atualizado com sucesso');
      } else {
        await workoutService.create(formData);
        toast.success('Treino criado com sucesso');
      }
      onSave();
      onClose();
    } catch (error) {
      toast.error('Erro ao salvar treino');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={workout ? 'Editar Plano de Treino' : 'Novo Plano de Treino'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Título do Plano"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Frequência Semanal
          </label>
          <select
            value={formData.weeklyFrequency}
            onChange={(e) => setFormData({ ...formData, weeklyFrequency: parseInt(e.target.value) })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value={3}>3x por semana</option>
            <option value={4}>4x por semana</option>
            <option value={5}>5x por semana</option>
          </select>
        </div>

        <div className="flex gap-2">
          <Button type="submit" fullWidth>
            Salvar
          </Button>
          <Button type="button" variant="secondary" fullWidth onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default Workouts;
