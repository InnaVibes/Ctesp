import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';
import Loading from '../components/Loading';
import Modal from '../components/Modal';
import workoutService from '../services/workoutService';
import { toast } from 'react-toastify';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { formatDate } from '../utils/helpers';

const MyWorkouts = () => {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [completionData, setCompletionData] = useState({
    completed: true,
    notes: '',
    proofImage: null,
  });

  // Usar useCallback para memorizar a função
  const loadWorkouts = useCallback(async () => {
    try {
      const data = await workoutService.getByClient(user._id);
      setWorkouts(data);
    } catch (error) {
      toast.error('Erro ao carregar treinos');
    } finally {
      setLoading(false);
    }
  }, [user._id]);

  useEffect(() => {
    loadWorkouts();
  }, [loadWorkouts]); // Agora a dependência está incluída

  const handleMarkWorkout = (workout) => {
    setSelectedWorkout(workout);
    setShowModal(true);
  };

  const handleSubmitCompletion = async (e) => {
    e.preventDefault();
    try {
      // Enviar dados de conclusão
      await workoutService.logCompletion(selectedWorkout._id, {
        date: selectedDate,
        completed: completionData.completed,
        notes: completionData.notes,
      });

      // Upload de imagem se houver
      if (completionData.proofImage) {
        await workoutService.uploadProof(selectedWorkout._id, completionData.proofImage);
      }

      toast.success('Treino registado com sucesso');
      setShowModal(false);
      loadWorkouts();
      setCompletionData({ completed: true, notes: '', proofImage: null });
    } catch (error) {
      toast.error('Erro ao registar treino');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCompletionData({ ...completionData, proofImage: file });
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Meus Treinos
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendário */}
        <Card className="lg:col-span-1">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Calendário
          </h2>
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            className="w-full border-none"
          />
        </Card>

        {/* Lista de treinos do dia selecionado */}
        <Card className="lg:col-span-2" title={`Treinos para ${formatDate(selectedDate)}`}>
          <div className="space-y-4">
            {workouts
              .filter(w => {
                // Filtrar treinos do dia selecionado
                const workoutDate = new Date(w.date);
                return workoutDate.toDateString() === selectedDate.toDateString();
              })
              .map(workout => (
                <div
                  key={workout._id}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {workout.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {workout.exercises?.length || 0} exercícios
                      </p>
                    </div>
                    <span
                      className={`
                        px-3 py-1 text-xs rounded-full
                        ${workout.completed
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }
                      `}
                    >
                      {workout.completed ? 'Concluído' : 'Pendente'}
                    </span>
                  </div>

                  {/* Lista de exercícios */}
                  <div className="mb-4">
                    {workout.exercises?.map((exercise, idx) => (
                      <div key={idx} className="text-sm text-gray-600 dark:text-gray-400 py-1">
                        • {exercise.name} - {exercise.sets}x{exercise.reps}
                      </div>
                    ))}
                  </div>

                  {!workout.completed && (
                    <Button
                      size="sm"
                      onClick={() => handleMarkWorkout(workout)}
                    >
                      Registar Treino
                    </Button>
                  )}
                </div>
              ))}

            {workouts.filter(w => {
              const workoutDate = new Date(w.date);
              return workoutDate.toDateString() === selectedDate.toDateString();
            }).length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  Nenhum treino agendado para este dia
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Modal de registro de treino */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Registar Treino"
      >
        <form onSubmit={handleSubmitCompletion} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Concluiu o treino?
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={completionData.completed === true}
                  onChange={() => setCompletionData({ ...completionData, completed: true })}
                  className="mr-2"
                />
                Sim
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={completionData.completed === false}
                  onChange={() => setCompletionData({ ...completionData, completed: false })}
                  className="mr-2"
                />
                Não
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {completionData.completed ? 'Notas (opcional)' : 'Motivo'}
            </label>
            <textarea
              value={completionData.notes}
              onChange={(e) => setCompletionData({ ...completionData, notes: e.target.value })}
              rows={3}
              placeholder={completionData.completed ? 'Como foi o treino?' : 'Por que não conseguiu completar?'}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              required={!completionData.completed}
            />
          </div>

          {completionData.completed && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Foto de Comprovação (opcional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full text-sm text-gray-500 dark:text-gray-400
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0
                  file:text-sm file:font-semibold
                  file:bg-primary-50 file:text-primary-700
                  hover:file:bg-primary-100
                  dark:file:bg-gray-700 dark:file:text-primary-400"
              />
            </div>
          )}

          <div className="flex gap-2">
            <Button type="submit" fullWidth>
              Confirmar
            </Button>
            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={() => setShowModal(false)}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MyWorkouts;