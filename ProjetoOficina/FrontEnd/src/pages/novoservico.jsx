import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { api } from '../services/api';
import { toast } from 'react-toastify';
import { ArrowLeft, Car } from 'lucide-react';

const NovoServico = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [veiculos, setVeiculos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingVeiculos, setLoadingVeiculos] = useState(true);

  useEffect(() => {
    loadVeiculos();
  }, []);

  const loadVeiculos = async () => {
    try {
      const response = await api.veiculos.getAll();
      setVeiculos(response.data);
    } catch (error) {
      toast.error('Erro ao carregar veículos');
      console.error(error);
    } finally {
      setLoadingVeiculos(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await api.servicos.create({
        ...data,
        price: parseFloat(data.price),
        scheduledDate: new Date(data.scheduledDate).toISOString()
      });
      toast.success('Serviço criado com sucesso! Aguarde a confirmação do administrador.');
      navigate('/servicos');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao criar serviço');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const servicosComuns = [
    'Revisão Geral',
    'Troca de Óleo',
    'Diagnóstico',
    'Reparação de Motor',
    'Troca de Pastilhas de Freio',
    'Alinhamento e Balanceamento',
    'Troca de Filtros',
    'Reparo de Suspensão',
    'Serviços Elétricos',
    'Ar Condicionado'
  ];

  if (loadingVeiculos) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/servicos')}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar para Serviços
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Novo Serviço</h1>
        <p className="mt-1 text-sm text-gray-600">
          Agende um novo serviço para seu veículo
        </p>
      </div>

      {veiculos.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Car className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum veículo encontrado</h3>
          <p className="mt-1 text-sm text-gray-500">
            Você precisa cadastrar um veículo antes de agendar serviços.
          </p>
          <div className="mt-6">
            <button
              onClick={() => navigate('/veiculos/novo')}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Cadastrar Veículo
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
            {/* Veículo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Veículo *
              </label>
              <select
                {...register('veiculoId', { required: 'Veículo é obrigatório' })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Selecione um veículo</option>
                {veiculos.map((veiculo) => (
                  <option key={veiculo._id} value={veiculo._id}>
                    {veiculo.make} {veiculo.model} - {veiculo.licensePlate}
                  </option>
                ))}
              </select>
              {errors.veiculoId && (
                <p className="mt-1 text-sm text-red-600">{errors.veiculoId.message}</p>
              )}
            </div>

            {/* Tipo de Serviço */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Serviço *
              </label>
              <select
                {...register('type', { required: 'Tipo de serviço é obrigatório' })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Selecione o tipo de serviço</option>
                {servicosComuns.map((servico) => (
                  <option key={servico} value={servico}>
                    {servico}
                  </option>
                ))}
                <option value="Outro">Outro</option>
              </select>
              {errors.type && (
                <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
              )}
            </div>

            {/* Tipo personalizado se "Outro" for selecionado */}
            {watch('type') === 'Outro' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Especifique o tipo de serviço *
                </label>
                <input
                  {...register('customType', { required: 'Especificação é obrigatória' })}
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Digite o tipo de serviço"
                />
                {errors.customType && (
                  <p className="mt-1 text-sm text-red-600">{errors.customType.message}</p>
                )}
              </div>
            )}

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição
              </label>
              <textarea
                {...register('description')}
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Descreva os detalhes do serviço..."
              />
            </div>

            {/* Data Agendada */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Preferida *
              </label>
              <input
                {...register('scheduledDate', { 
                  required: 'Data é obrigatória',
                  validate: (value) => {
                    const selectedDate = new Date(value);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return selectedDate >= today || 'Data deve ser hoje ou no futuro';
                  }
                })}
                type="datetime-local"
                min={new Date().toISOString().slice(0, 16)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              {errors.scheduledDate && (
                <p className="mt-1 text-sm text-red-600">{errors.scheduledDate.message}</p>
              )}
            </div>

            {/* Preço Estimado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preço Estimado (R$) *
              </label>
              <input
                {...register('price', { 
                  required: 'Preço é obrigatório',
                  min: { value: 0.01, message: 'Preço deve ser maior que zero' }
                })}
                type="number"
                step="0.01"
                min="0"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="0.00"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
              )}
            </div>

            {/* Tempo Estimado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tempo Estimado
              </label>
              <select
                {...register('estimatedTime')}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Selecione o tempo estimado</option>
                <option value="1 hora">1 hora</option>
                <option value="2 horas">2 horas</option>
                <option value="4 horas">4 horas</option>
                <option value="1 dia">1 dia</option>
                <option value="2 dias">2 dias</option>
                <option value="1 semana">1 semana</option>
              </select>
            </div>

            {/* Observações */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observações
              </label>
              <textarea
                {...register('observations')}
                rows={2}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Observações adicionais..."
              />
            </div>

            {/* Botões */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <button
                type="button"
                onClick={() => navigate('/servicos')}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Criando...' : 'Criar Serviço'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default NovoServico;