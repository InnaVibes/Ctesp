import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaSearch, FaHeart, FaRegHeart, FaStar, FaFilter, FaTimes } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const Catalogo = () => {
    const { user, isAuthenticated } = useAuth();
    const [servicos, setServicos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categorias, setCategorias] = useState([]);
    const [tags, setTags] = useState([]);
    
    // Estados de filtros
    const [filtros, setFiltros] = useState({
        search: '',
        category: 'all',
        tags: [],
        minPrice: '',
        maxPrice: '',
        sort: 'name_asc'
    });
    
    // Estados de paginação
    const [paginacao, setPaginacao] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        hasNext: false,
        hasPrev: false
    });
    
    const [showFilters, setShowFilters] = useState(false);

    // Carregar dados iniciais
    useEffect(() => {
        carregarCategorias();
        carregarTags();
    }, []);

    // Carregar serviços quando filtros mudarem
    useEffect(() => {
        carregarServicos();
    }, [filtros, paginacao.currentPage]);

    const carregarServicos = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: paginacao.currentPage,
                limit: 12,
                ...filtros,
                tags: filtros.tags.join(',')
            });

            const response = await axios.get(`/api/catalogo?${params}`);
            setServicos(response.data.servicos);
            setPaginacao({
                currentPage: response.data.currentPage,
                totalPages: response.data.totalPages,
                totalItems: response.data.totalItems,
                hasNext: response.data.hasNext,
                hasPrev: response.data.hasPrev
            });
        } catch (error) {
            toast.error('Erro ao carregar serviços');
        } finally {
            setLoading(false);
        }
    };

    const carregarCategorias = async () => {
        try {
            const response = await axios.get('/api/catalogo/categorias');
            setCategorias(response.data);
        } catch (error) {
            console.error('Erro ao carregar categorias:', error);
        }
    };

    const carregarTags = async () => {
        try {
            const response = await axios.get('/api/catalogo/tags');
            setTags(response.data);
        } catch (error) {
            console.error('Erro ao carregar tags:', error);
        }
    };

    const handleFiltroChange = (key, value) => {
        setFiltros(prev => ({
            ...prev,
            [key]: value
        }));
        setPaginacao(prev => ({ ...prev, currentPage: 1 }));
    };

    const handleTagToggle = (tagName) => {
        setFiltros(prev => ({
            ...prev,
            tags: prev.tags.includes(tagName)
                ? prev.tags.filter(t => t !== tagName)
                : [...prev.tags, tagName]
        }));
        setPaginacao(prev => ({ ...prev, currentPage: 1 }));
    };

    const limparFiltros = () => {
        setFiltros({
            search: '',
            category: 'all',
            tags: [],
            minPrice: '',
            maxPrice: '',
            sort: 'name_asc'
        });
        setPaginacao(prev => ({ ...prev, currentPage: 1 }));
    };

    const toggleFavorito = async (servicoId) => {
        if (!isAuthenticated()) {
            toast.info('Faça login para adicionar aos favoritos');
            return;
        }

        try {
            const servico = servicos.find(s => s._id === servicoId);
            
            if (servico.isFavorito) {
                await axios.delete(`/api/favoritos/${servicoId}`);
                toast.success('Removido dos favoritos');
            } else {
                await axios.post('/api/favoritos', { catalogoServicoId: servicoId });
                toast.success('Adicionado aos favoritos');
            }

            // Atualizar estado local
            setServicos(prev => prev.map(s => 
                s._id === servicoId 
                    ? { ...s, isFavorito: !s.isFavorito }
                    : s
            ));
        } catch (error) {
            toast.error('Erro ao atualizar favoritos');
        }
    };

    const mudarPagina = (novaPagina) => {
        setPaginacao(prev => ({ ...prev, currentPage: novaPagina }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading && paginacao.currentPage === 1) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h1 className="text-3xl font-bold text-gray-900">Catálogo de Serviços</h1>
                    <p className="text-gray-600 mt-2">
                        Encontre o serviço perfeito para seu veículo
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar de Filtros */}
                    <div className="lg:w-1/4">
                        <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold">Filtros</h3>
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="lg:hidden text-blue-600"
                                >
                                    <FaFilter />
                                </button>
                            </div>

                            <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                                {/* Busca */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Buscar
                                    </label>
                                    <div className="relative">
                                        <FaSearch className="absolute left-3 top-3 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Nome do serviço..."
                                            value={filtros.search}
                                            onChange={(e) => handleFiltroChange('search', e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                {/* Categoria */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Categoria
                                    </label>
                                    <select
                                        value={filtros.category}
                                        onChange={(e) => handleFiltroChange('category', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="all">Todas as categorias</option>
                                        {categorias.map(categoria => (
                                            <option key={categoria} value={categoria}>
                                                {categoria}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Faixa de Preço */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Faixa de Preço
                                    </label>
                                    <div className="flex space-x-2">
                                        <input
                                            type="number"
                                            placeholder="Min"
                                            value={filtros.minPrice}
                                            onChange={(e) => handleFiltroChange('minPrice', e.target.value)}
                                            className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Max"
                                            value={filtros.maxPrice}
                                            onChange={(e) => handleFiltroChange('maxPrice', e.target.value)}
                                            className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                {/* Tags */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tags Populares
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {tags.slice(0, 10).map(tag => (
                                            <button
                                                key={tag.name}
                                                onClick={() => handleTagToggle(tag.name)}
                                                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                                                    filtros.tags.includes(tag.name)
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                }`}
                                            >
                                                {tag.name} ({tag.count})
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Botão Limpar Filtros */}
                                <button
                                    onClick={limparFiltros}
                                    className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                                >
                                    Limpar Filtros
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Conteúdo Principal */}
                    <div className="lg:w-3/4">
                        {/* Barra de Ordenação */}
                        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div className="text-sm text-gray-600">
                                    Mostrando {servicos.length} de {paginacao.totalItems} serviços
                                </div>
                                <div className="flex items-center space-x-2">
                                    <label className="text-sm text-gray-600">Ordenar por:</label>
                                    <select
                                        value={filtros.sort}
                                        onChange={(e) => handleFiltroChange('sort', e.target.value)}
                                        className="px-3 py-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="name_asc">Nome (A-Z)</option>
                                        <option value="name_desc">Nome (Z-A)</option>
                                        <option value="price_asc">Preço (Menor)</option>
                                        <option value="price_desc">Preço (Maior)</option>
                                        <option value="newest">Mais Recente</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Grid de Serviços */}
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                                        <div className="h-4 bg-gray-200 rounded mb-4"></div>
                                        <div className="h-3 bg-gray-200 rounded mb-2"></div>
                                        <div className="h-3 bg-gray-200 rounded mb-4"></div>
                                        <div className="h-6 bg-gray-200 rounded"></div>
                                    </div>
                                ))}
                            </div>
                        ) : servicos.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-gray-500 text-lg">
                                    Nenhum serviço encontrado
                                </div>
                                <p className="text-gray-400 mt-2">
                                    Tente ajustar seus filtros de busca
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {servicos.map(servico => (
                                    <div key={servico._id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                        <div className="p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {servico.name}
                                                </h3>
                                                {isAuthenticated() && (
                                                    <button
                                                        onClick={() => toggleFavorito(servico._id)}
                                                        className="text-red-500 hover:text-red-600 transition-colors"
                                                    >
                                                        {servico.isFavorito ? <FaHeart /> : <FaRegHeart />}
                                                    </button>
                                                )}
                                            </div>
                                            
                                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                                {servico.description}
                                            </p>
                                            
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="text-2xl font-bold text-blue-600">
                                                    R$ {servico.basePrice.toFixed(2)}
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    {servico.estimatedDuration}
                                                </span>
                                            </div>
                                            
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {servico.tags.slice(0, 3).map(tag => (
                                                    <span
                                                        key={tag}
                                                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                            
                                            <Link
                                                to={`/servico/${servico._id}`}
                                                className="block w-full text-center bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
                                            >
                                                Ver Detalhes
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Paginação */}
                        {paginacao.totalPages > 1 && (
                            <div className="mt-8 flex justify-center">
                                <nav className="flex items-center space-x-2">
                                    <button
                                        onClick={() => mudarPagina(paginacao.currentPage - 1)}
                                        disabled={!paginacao.hasPrev}
                                        className="px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Anterior
                                    </button>
                                    
                                    {[...Array(paginacao.totalPages)].map((_, i) => {
                                        const pageNum = i + 1;
                                        let buttonClass = 'bg-white border border-gray-300 text-gray-500 hover:bg-gray-50';
                                    
                                        if (pageNum === paginacao.currentPage) {
                                            buttonClass = 'bg-blue-600 text-white';
                                        }
                                    
                                        if (
                                            pageNum === 1 ||
                                            pageNum === paginacao.totalPages ||
                                            (pageNum >= paginacao.currentPage - 2 && pageNum <= paginacao.currentPage + 2)
                                        ) {
                                            return (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => mudarPagina(pageNum)}
                                                    className={`px-3 py-2 rounded-md ${buttonClass}`}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        }
                                    
                                        if (
                                            pageNum === paginacao.currentPage - 3 ||
                                            pageNum === paginacao.currentPage + 3
                                        ) {
                                            return <span key={pageNum} className="px-2 text-gray-400">...</span>;
                                        }
                                    
                                        return null;
                                    })}
                                    
                                    <button
                                        onClick={() => mudarPagina(paginacao.currentPage + 1)}
                                        disabled={!paginacao.hasNext}
                                        className="px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Próxima
                                    </button>
                                </nav>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Catalogo;