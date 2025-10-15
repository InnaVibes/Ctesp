import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaCar, FaUser, FaBars, FaTimes, FaHeart, FaCog, FaSignOutAlt } from 'react-icons/fa';

const Navbar = () => {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsUserMenuOpen(false);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleUserMenu = () => {
        setIsUserMenuOpen(!isUserMenuOpen);
    };

    return (
        <nav className="bg-blue-600 shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 text-white hover:text-blue-200 transition-colors">
                        <FaCar className="text-2xl" />
                        <span className="text-xl font-bold">AutoService</span>
                    </Link>

                    {/* Links principais - Desktop */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-white hover:text-blue-200 transition-colors">
                            Início
                        </Link>
                        <Link to="/catalogo" className="text-white hover:text-blue-200 transition-colors">
                            Catálogo
                        </Link>
                        {user && (
                            <>
                                <Link to="/veiculos" className="text-white hover:text-blue-200 transition-colors">
                                    Meus Veículos
                                </Link>
                                <Link to="/meus-servicos" className="text-white hover:text-blue-200 transition-colors">
                                    Meus Serviços
                                </Link>
                                <Link to="/favoritos" className="text-white hover:text-blue-200 transition-colors">
                                    <FaHeart className="inline mr-1" />
                                    Favoritos
                                </Link>
                            </>
                        )}
                        {isAdmin() && (
                            <Link to="/admin" className="text-yellow-300 hover:text-yellow-200 transition-colors font-semibold">
                                Admin
                            </Link>
                        )}
                    </div>

                    {/* Área do usuário - Desktop */}
                    <div className="hidden md:flex items-center space-x-4">
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={toggleUserMenu}
                                    className="flex items-center space-x-2 text-white hover:text-blue-200 transition-colors"
                                >
                                    <FaUser className="text-lg" />
                                    <span>{user.name}</span>
                                </button>
                                
                                {isUserMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                                        <Link
                                            to="/profile"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            onClick={() => setIsUserMenuOpen(false)}
                                        >
                                            <FaCog className="inline mr-2" />
                                            Meu Perfil
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            <FaSignOutAlt className="inline mr-2" />
                                            Sair
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-x-4">
                                <Link
                                    to="/login"
                                    className="text-white hover:text-blue-200 transition-colors"
                                >
                                    Entrar
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-md transition-colors"
                                >
                                    Cadastrar
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Menu mobile toggle */}
                    <div className="md:hidden">
                        <button
                            onClick={toggleMenu}
                            className="text-white hover:text-blue-200 transition-colors"
                        >
                            {isMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
                        </button>
                    </div>
                </div>

                {/* Menu mobile */}
                {isMenuOpen && (
                    <div className="md:hidden bg-blue-700 pb-4">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            <Link
                                to="/"
                                className="block px-3 py-2 text-white hover:text-blue-200 transition-colors"
                                onClick={toggleMenu}
                            >
                                Início
                            </Link>
                            <Link
                                to="/catalogo"
                                className="block px-3 py-2 text-white hover:text-blue-200 transition-colors"
                                onClick={toggleMenu}
                            >
                                Catálogo
                            </Link>
                            {user && (
                                <>
                                    <Link
                                        to="/veiculos"
                                        className="block px-3 py-2 text-white hover:text-blue-200 transition-colors"
                                        onClick={toggleMenu}
                                    >
                                        Meus Veículos
                                    </Link>
                                    <Link
                                        to="/meus-servicos"
                                        className="block px-3 py-2 text-white hover:text-blue-200 transition-colors"
                                        onClick={toggleMenu}
                                    >
                                        Meus Serviços
                                    </Link>
                                    <Link
                                        to="/favoritos"
                                        className="block px-3 py-2 text-white hover:text-blue-200 transition-colors"
                                        onClick={toggleMenu}
                                    >
                                        <FaHeart className="inline mr-1" />
                                        Favoritos
                                    </Link>
                                </>
                            )}
                            {isAdmin() && (
                                <Link
                                    to="/admin"
                                    className="block px-3 py-2 text-yellow-300 hover:text-yellow-200 transition-colors font-semibold"
                                    onClick={toggleMenu}
                                >
                                    Admin
                                </Link>
                            )}
                        </div>

                        {/* Área do usuário mobile */}
                        <div className="px-2 pt-4 border-t border-blue-500">
                            {user ? (
                                <div className="space-y-1">
                                    <div className="px-3 py-2 text-white font-medium">
                                        <FaUser className="inline mr-2" />
                                        {user.name}
                                    </div>
                                    <Link
                                        to="/profile"
                                        className="block px-3 py-2 text-white hover:text-blue-200 transition-colors"
                                        onClick={toggleMenu}
                                    >
                                        <FaCog className="inline mr-2" />
                                        Meu Perfil
                                    </Link>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            toggleMenu();
                                        }}
                                        className="block w-full text-left px-3 py-2 text-white hover:text-blue-200 transition-colors"
                                    >
                                        <FaSignOutAlt className="inline mr-2" />
                                        Sair
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    <Link
                                        to="/login"
                                        className="block px-3 py-2 text-white hover:text-blue-200 transition-colors"
                                        onClick={toggleMenu}
                                    >
                                        Entrar
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="block px-3 py-2 bg-blue-500 hover:bg-blue-400 text-white rounded-md transition-colors mx-3"
                                        onClick={toggleMenu}
                                    >
                                        Cadastrar
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;