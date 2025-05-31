import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AuthContext = createContext();

// Estados e ações do reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload },
        loading: false
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

// Estado inicial
const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,
  error: null
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Configurar axios defaults e interceptors
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Verificar se o token ainda é válido
      checkTokenValidity();
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }

    // Interceptor para lidar com erros de autenticação
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          logout();
          toast.error('Sessão expirada. Faça login novamente.');
        }
        return Promise.reject(error);
      }
    );

    // Cleanup
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  // Verificar validade do token
  const checkTokenValidity = async () => {
    try {
      const response = await axios.post('/api/auth/verify-token');
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: response.data.user,
          token: localStorage.getItem('token')
        }
      });
    } catch (error) {
      console.error('Token inválido:', error);
      logout();
    }
  };

  // Função de login
  const login = async (email, password) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const response = await axios.post('/api/auth/login', { 
        email, 
        password 
      });

      const { token, user } = response.data;
      
      // Salvar token no localStorage
      localStorage.setItem('token', token);
      
      // Configurar header do axios
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Atualizar estado
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, token }
      });
      
      return { success: true, message: 'Login realizado com sucesso!' };
    } catch (error) {
      const message = error.response?.data?.message || 'Erro no login';
      dispatch({ type: 'LOGIN_FAILURE', payload: message });
      return { success: false, message };
    }
  };

  // Função de registro
  const register = async (userData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      await axios.post('/api/auth/register', userData);
      
      dispatch({ type: 'SET_LOADING', payload: false });
      return { success: true, message: 'Conta criada com sucesso!' };
    } catch (error) {
      const message = error.response?.data?.message || 'Erro no registro';
      dispatch({ type: 'SET_ERROR', payload: message });
      return { success: false, message };
    }
  };

  // Função de logout
  const logout = async () => {
    try {
      // Chamar endpoint de logout (opcional)
      await axios.post('/api/auth/logout');
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      // Limpar dados locais
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      
      // Atualizar estado
      dispatch({ type: 'LOGOUT' });
    }
  };

  // Atualizar perfil
  const updateProfile = async (profileData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await axios.put('/api/auth/profile', profileData);
      
      dispatch({ 
        type: 'UPDATE_USER', 
        payload: response.data.user 
      });
      
      return { success: true, message: 'Perfil atualizado com sucesso!' };
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao atualizar perfil';
      dispatch({ type: 'SET_ERROR', payload: message });
      return { success: false, message };
    }
  };

  // Alterar senha
  const changePassword = async (passwordData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      await axios.put('/api/auth/change-password', passwordData);
      
      dispatch({ type: 'SET_LOADING', payload: false });
      return { success: true, message: 'Senha alterada com sucesso!' };
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao alterar senha';
      dispatch({ type: 'SET_ERROR', payload: message });
      return { success: false, message };
    }
  };

  // Recuperar senha
  const forgotPassword = async (email) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      await axios.post('/api/auth/forgot-password', { email });
      
      dispatch({ type: 'SET_LOADING', payload: false });
      return { success: true, message: 'Email de recuperação enviado!' };
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao enviar email';
      dispatch({ type: 'SET_ERROR', payload: message });
      return { success: false, message };
    }
  };

  // Resetar senha
  const resetPassword = async (token, newPassword) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      await axios.post(`/api/auth/reset-password/${token}`, { 
        newPassword 
      });
      
      dispatch({ type: 'SET_LOADING', payload: false });
      return { success: true, message: 'Senha resetada com sucesso!' };
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao resetar senha';
      dispatch({ type: 'SET_ERROR', payload: message });
      return { success: false, message };
    }
  };

  // Funções helper
  const isAuthenticated = () => {
    return state.isAuthenticated && state.token && state.user;
  };

  const isAdmin = () => {
    return state.user?.role === 'admin';
  };

  const isClient = () => {
    return state.user?.role === 'client';
  };

  // Limpar erros
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Valor do contexto
  const contextValue = {
    // Estado
    ...state,
    
    // Funções de autenticação
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    
    // Funções helper
    isAuthenticated,
    isAdmin,
    isClient,
    clearError,
    
    // Verificar token
    checkTokenValidity
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook customizado para usar o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  
  return context;
};

// HOC para componentes que precisam de autenticação
export const withAuth = (Component) => {
  return function AuthenticatedComponent(props) {
    const { isAuthenticated, loading } = useAuth();
    
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
        </div>
      );
    }
    
    if (!isAuthenticated()) {
      return <Navigate to="/login" replace />;
    }
    
    return <Component {...props} />;
  };
};

// HOC para componentes que precisam de permissão de admin
export const withAdminAuth = (Component) => {
  return function AdminAuthenticatedComponent(props) {
    const { isAuthenticated, isAdmin, loading } = useAuth();
    
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
        </div>
      );
    }
    
    if (!isAuthenticated()) {
      return <Navigate to="/login" replace />;
    }
    
    if (!isAdmin()) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Acesso Negado</h2>
            <p className="text-gray-600 mb-4">Você não tem permissão para acessar esta área.</p>
          </div>
        </div>
      );
    }
    
    return <Component {...props} />;
  };
};

export default AuthContext;