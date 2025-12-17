import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

// Criar contexto de autenticação
const AuthContext = createContext();

// Provider de autenticação
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Verificar se há um usuário autenticado ao carregar
  useEffect(() => {
    checkAuth();
  }, []);

  // Função para verificar autenticação
  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        // Configurar token no header da API
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Buscar dados do usuário
        const response = await api.get('/auth/me');
        setUser(response.data);
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  // Função de login com username/password
  const login = async (username, password) => {
    try {
      const response = await api.post('/auth/login', { username, password });
      const { token, user } = response.data;
      
      // Salvar token no localStorage
      localStorage.setItem('token', token);
      
      // Configurar token no header da API
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Atualizar estado do usuário
      setUser(user);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Erro ao fazer login' 
      };
    }
  };

  // Função de login com QR Code
  const loginWithQRCode = async (qrData) => {
    try {
      const response = await api.post('/auth/login-qr', { qrData });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'QR Code inválido' 
      };
    }
  };

  // Função de registro
  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return { success: true, message: 'Registo realizado com sucesso!' };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Erro ao registar' 
      };
    }
  };

  // Função de logout
  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    navigate('/login');
  };

  // Função para atualizar dados do usuário
  const updateUser = (updatedData) => {
    setUser(prev => ({ ...prev, ...updatedData }));
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      loginWithQRCode,
      register,
      logout,
      updateUser,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
      isTrainer: user?.role === 'trainer',
      isClient: user?.role === 'client',
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook customizado para usar o contexto de autenticação
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};

export default AuthContext;
