import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await api.post('/auth/login', { username, password });
      const { token, user: userData } = response.data;

      if (userData.role === 'PT' && !userData.isValidated) {
        throw new Error('Sua conta de PT ainda não foi validada pelo administrador.');
      }

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setUser(userData);
      setIsAuthenticated(true);

      return userData;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Erro ao fazer login';
      throw new Error(errorMessage);
    }
  };

  const register = async (username, password, role, email) => {
    try {
      const response = await api.post('/auth/register', {
        username,
        password,
        role,
        email,
      });

      if (role === 'PT') {
        toast.info('Conta criada! Aguarde a validação do administrador para fazer login.');
      }

      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erro ao registar';
      throw new Error(errorMessage);
    }
  };

  const loginWithQRCode = async (qrToken) => {
    try {
      const response = await api.post('/auth/qr-login', { qrToken });
      const { token, user: userData } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setUser(userData);
      setIsAuthenticated(true);

      return userData;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erro ao fazer login com QR Code';
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    // Limpar estado
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    
    setUser(null);
    setIsAuthenticated(false);

    // Redirecionar após state ser atualizado
    setTimeout(() => {
      window.location.href = '/login';
    }, 0);
  };

  const updateUser = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const isAdmin = user?.role === 'ADMIN';
  const isTrainer = user?.role === 'PT';
  const isClient = user?.role === 'CLIENT';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        isAdmin,
        isTrainer,
        isClient,
        login,
        register,
        loginWithQRCode,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};