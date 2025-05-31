import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaHeart, FaRegHeart, FaStar, FaClock, FaTools, FaShieldAlt, FaArrowLeft } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import AvaliacaoForm from '../components/avaliacaoform';

const ServicoDetalhes = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const [servico, setServico] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAvaliacaoForm, setShowAvaliacaoForm] = useState(false);
    const [minhaAvaliacao, setMinhaAvaliacao] = useState(null);

    useEffect(() => {
        carregarServico();
    }, [id]);

    const carregarServico = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/catalogo/${id}`);
            setServico(response.data);
            
            // Verificar se o usuário já avaliou este serviço
            if (isAuthenticated() && response.data.avaliacoes) {
                const avaliacaoExistente = response.data.avaliacoes.find(
                    av => av.userId._id === user.id
                );
                setMinhaAvaliacao(avaliacaoExistente);
            }
        } catch (error) {
            toast.error('Erro ao carregar detalhes do serviço');
            navigate('/catalogo');
        } finally {
            setLoading(false);
        }
    };

    const toggleFavorito = async () => {
        if (!isAuthenticated()) {
            toast.info('Faça login para adicionar aos favoritos');
            return;
        }

        try {
            if (servico.isFavorito) {
                await axios.delete(`/api/favoritos/${servico._id}`);
                toast.success('Removido dos favoritos');
            } else {
                await axios.post('/api/favoritos', { catalogoServicoId: servico._id });
                toast.success('Adicionado aos favoritos');
            }

            setServico(prev => ({ ...prev, isFavorito: !prev.isFavorito }));
        } catch (error) {
            toast.error('Erro ao atualizar favoritos');
        }
    };

    const handleNovaAvaliacao = (novaAvaliacao) => {
        setServico(prev => ({
            ...prev,
            avaliacoes: [novaAvaliacao, ...prev.avaliacoes]
        }));
        setMinhaAvaliacao(novaAvaliacao);
        setShowAvaliacaoForm(false);
        toast.success('Avaliação enviada! Aguarde aprovação.');
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <FaStar
                key={i}
                className={i < rating ? 'text-yellow-400' : 'text-gray-300'}
            />
        ));
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!servico) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Serviço não encontrado</h2>
                    <Link to="/catalogo" className="text-blue-600 hover:text-blue-800">
                        Voltar ao catálogo
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Botão Voltar */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
                >
                    <FaArrowLeft className="mr-2" />
                    Voltar
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Informações Principais */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm p-8">
                            <div className="flex justify-between items-start mb-6">
                                <h1 className="text-3xl font-bold text-gray-900">
                                    {servico.name}
                                </h1>
                                {isAuthenticated() && (
                                    <button
                                        onClick={toggleFavorito}
                                        className="text-red-500 hover:text-red-600 transition-colors text-2xl"
                                    >
                                        {servico.isFavorito ? <FaHeart /> : <FaRegHeart />}
                                    </button>
                                )}
                            </div>

                            {/* Avaliação */}
                            {servico.totalAvaliacoes > 0 && (
                                <div className="flex items-center mb-6">
                                    <div className="flex items-center mr-4">
                                        {renderStars(Math.round(servico.mediaAvaliacoes))}
                                    </div>
                                    <span className="text-lg font-semibold text-gray-900">
                                        {servico.mediaAvaliacoes.toFixed(1)}
                                    </span>
                                    <span className="text-gray-600 ml-2">
                                        ({servico.totalAvaliacoes} avaliações)
                                    </span>
                                </div>
                            )}

                            {/* Descrição */}
                            <div className="mb-8">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Descrição</h2>
                                <p className="text-gray-700 leading-relaxed">
                                    {servico.description}
                                </p>
                            </div>

                            {/* Informações Técnicas */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div className="flex items-center">
                                    <FaClock className="text-blue-600 text-xl mr-3" />
                                    <div>
                                        <div className="font-semibold text-gray-900">Duração Estimada</div>
                                        <div className="text-gray-600">{servico.estimatedDuration}</div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center">
                                    <FaTools className="text-blue-600 text-xl mr-3" />
                                    <div>
                                        <div className="font-semibold text-gray-900">Dificuldade</div>
                                        <div className="text-gray-600 capitalize">{servico.difficulty}</div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center">
                                    <FaShieldAlt className="text-blue-600 text-xl mr-3" />
                                    <div>
                                        <div className="font-semibold text-gray-900">Categoria</div>
                                        <div className="text-gray-600">{servico.category}</div>
                                    </div>
                                </div>

                                {servico.prerequisites && servico.prerequisites.length > 0 && (
                                    <div className="flex items-start">
                                        <FaTools className="text-blue-600 text-xl mr-3 mt-1" />
                                        <div>
                                            <div className="font-semibold text-gray-900">Pré-requisitos</div>
                                            <div className="text-gray-600">
                                                {servico.prerequisites.join(', ')}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Tags */}
                            {servico.tags && servico.tags.length > 0 && (
                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {servico.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Avaliações */}
                            <div className="border-t pt-8">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-semibold text-gray-900">
                                        Avaliações ({servico.totalAvaliacoes || 0})
                                    </h3>
                                    {isAuthenticated() && !minhaAvaliacao && (
                                        <button
                                            onClick={() => setShowAvaliacaoForm(true)}
                                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            Avaliar Serviço
                                        </button>
                                    )}
                                </div>

                                {/* Formulário de Avaliação */}
                                {showAvaliacaoForm && (
                                    <div className="mb-6 p-6 bg-gray-50 rounded-lg">
                                        <AvaliacaoForm
                                            catalogoServicoId={servico._id}
                                            onAvaliacaoEnviada={handleNovaAvaliacao}
                                            onCancel={() => setShowAvaliacaoForm(false)}
                                        />
                                    </div>
                                )}

                                {/* Lista de Avaliações */}
                                {servico.avaliacoes && servico.avaliacoes.length > 0 ? (
                                    <div className="space-y-6">
                                        {servico.avaliacoes
                                            .filter(avaliacao => avaliacao.status === 'approved')
                                            .map((avaliacao) => (
                                                <div key={avaliacao._id} className="border-b pb-6 last:border-b-0">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div className="flex items-center">
                                                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                                                                {avaliacao.userId.name.charAt(0).toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <div className="font-semibold text-gray-900">
                                                                    {avaliacao.userId.name}
                                                                </div>
                                                                <div className="flex items-center">
                                                                    {renderStars(avaliacao.rating)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {new Date(avaliacao.createdAt).toLocaleDateString('pt-BR')}
                                                        </div>
                                                    </div>
                                                    {avaliacao.comment && (
                                                        <p className="text-gray-700 ml-11">
                                                            {avaliacao.comment}
                                                        </p>
                                                    )}
                                                </div>
                                            ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center py-8">
                                        Ainda não há avaliações para este serviço.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Informações do Serviço
                            </h3>
                            
                            <div className="space-y-4">
                                <div>
                                    <div className="text-sm text-gray-600">Status</div>
                                    <div className="font-semibold text-green-600 capitalize">
                                        {servico.status === 'active' ? 'Ativo' : servico.status}
                                    </div>
                                </div>

                                {servico.price && (
                                    <div>
                                        <div className="text-sm text-gray-600">Preço</div>
                                        <div className="font-semibold text-gray-900">
                                            R$ {servico.price.toFixed(2)}
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <div className="text-sm text-gray-600">Criado em</div>
                                    <div className="font-semibold text-gray-900">
                                        {new Date(servico.createdAt).toLocaleDateString('pt-BR')}
                                    </div>
                                </div>

                                {servico.updatedAt && (
                                    <div>
                                        <div className="text-sm text-gray-600">Atualizado em</div>
                                        <div className="font-semibold text-gray-900">
                                            {new Date(servico.updatedAt).toLocaleDateString('pt-BR')}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Ações */}
                            <div className="mt-6 space-y-3">
                                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                                    Solicitar Serviço
                                </button>
                                
                                <button 
                                    onClick={toggleFavorito}
                                    className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
                                >
                                    {servico.isFavorito ? <FaHeart className="mr-2" /> : <FaRegHeart className="mr-2" />}
                                    {servico.isFavorito ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
                                </button>

                                <Link
                                    to="/catalogo"
                                    className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-center block"
                                >
                                    Voltar ao Catálogo
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServicoDetalhes;