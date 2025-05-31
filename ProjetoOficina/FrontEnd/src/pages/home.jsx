import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaCar, FaTools, FaShieldAlt, FaClock, FaStar, FaArrowRight } from 'react-icons/fa';

const Home = () => {
    const [servicosPopulares, setServicosPopulares] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        carregarServicosPopulares();
    }, []);

    const carregarServicosPopulares = async () => {
        try {
            const response = await axios.get('/api/catalogo?limit=6&sort=newest');
            setServicosPopulares(response.data.servicos);
        } catch (error) {
            console.error('Erro ao carregar serviços:', error);
        } finally {
            setLoading(false);
        }
    };

    const features = [
        {
            icon: <FaTools className="text-3xl text-blue-600" />,
            title: 'Serviços Especializados',
            description: 'Ampla gama de serviços automotivos realizados por profissionais qualificados'
        },
        {
            icon: <FaShieldAlt className="text-3xl text-blue-600" />,
            title: 'Garantia de Qualidade',
            description: 'Todos os serviços possuem garantia e são realizados com peças de qualidade'
        },
        {
            icon: <FaClock className="text-3xl text-blue-600" />,
            title: 'Agendamento Flexível',
            description: 'Agende seus serviços no horário que for mais conveniente para você'
        }
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Cuidamos do seu
                            <span className="block text-blue-200">Veículo</span>
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
                            Serviços automotivos de qualidade com profissionais especializados. 
                            Seu carro em boas mãos!
                        </p>
                        <div className="space-x-4">
                            <Link
                                to="/catalogo"
                                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-flex items-center"
                            >
                                Ver Catálogo
                                <FaArrowRight className="ml-2" />
                            </Link>
                            <Link
                                to="/register"
                                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                            >
                                Criar Conta
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Por que escolher nossos serviços?
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Oferecemos uma experiência completa de cuidado automotivo com qualidade, 
                            confiabilidade e preços justos.
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                                <div className="flex justify-center mb-4">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Serviços Populares */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Serviços Mais Procurados
                        </h2>
                        <p className="text-gray-600">
                            Confira alguns dos nossos serviços mais populares
                        </p>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                                    <div className="h-3 bg-gray-200 rounded mb-2"></div>
                                    <div className="h-3 bg-gray-200 rounded mb-4"></div>
                                    <div className="h-6 bg-gray-200 rounded"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {servicosPopulares.map(servico => (
                                <div key={servico._id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                    <div className="p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            {servico.name}
                                        </h3>
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                            {servico.description}
                                        </p>
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-xl font-bold text-blue-600">
                                                R$ {servico.basePrice.toFixed(2)}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                {servico.estimatedDuration}
                                            </span>
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

                    <div className="text-center mt-8">
                        <Link
                            to="/catalogo"
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
                        >
                            Ver Todos os Serviços
                            <FaArrowRight className="ml-2" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-blue-600 text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <FaCar className="text-5xl mx-auto mb-6" />
                    <h2 className="text-3xl font-bold mb-4">
                        Pronto para cuidar do seu veículo?
                    </h2>
                    <p className="text-xl mb-8 text-blue-100">
                        Cadastre-se agora e tenha acesso a todos os nossos serviços especializados
                    </p>
                    <Link
                        to="/register"
                        className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-flex items-center"
                    >
                        Criar Conta Grátis
                        <FaArrowRight className="ml-2" />
                    </Link>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-gray-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-3xl font-bold text-blue-400 mb-2">500+</div>
                            <div className="text-gray-300">Clientes Satisfeitos</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-blue-400 mb-2">15+</div>
                            <div className="text-gray-300">Tipos de Serviços</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-blue-400 mb-2">2000+</div>
                            <div className="text-gray-300">Serviços Realizados</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-blue-400 mb-2">4.8</div>
                            <div className="text-gray-300 flex items-center justify-center">
                                <FaStar className="text-yellow-400 mr-1" />
                                Avaliação Média
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;