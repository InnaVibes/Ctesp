import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Loading from '../components/Loading';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { updateUser } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const userStr = searchParams.get('user');
    const error = searchParams.get('error');

    if (error) {
      alert('Falha na autenticação Google');
      navigate('/login');
      return;
    }

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        updateUser(user);
        
        navigate('/');
      } catch (err) {
        console.error('Erro ao processar autenticação:', err);
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [searchParams, navigate, updateUser]);

  return <Loading text="Autenticando..." />;
};

export default AuthCallback;