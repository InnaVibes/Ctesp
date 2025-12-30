import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import { toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();
  const { login, loginWithQRCode } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [showQRLogin, setShowQRLogin] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username.trim() || !formData.password.trim()) {
      toast.error('Preencha todos os campos');
      return;
    }

    setLoading(true);

    try {
      await login(formData.username, formData.password);
      toast.success('Login realizado com sucesso!');
      navigate('/');
    } catch (error) {
      console.error('Erro no login:', error);
      toast.error(error.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  const handleQRLogin = async () => {
    setLoading(true);
    try {
      await loginWithQRCode('valid_qr_code');
      toast.success('Login com QR Code realizado!');
      navigate('/');
    } catch (error) {
      toast.error('Erro ao fazer login com QR Code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
          PT Platform
        </h2>

        {!showQRLogin ? (
          <>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Digite seu username"
                required
              />

              <Input
                label="Senha"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Digite sua senha"
                required
              />

              <Button type="submit" fullWidth loading={loading}>
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>

            <div className="mt-4">
              <Button
                variant="secondary"
                fullWidth
                onClick={() => setShowQRLogin(true)}
                disabled={loading}
              >
                Login com QR Code
              </Button>
            </div>

            <div className="mt-6 text-center space-y-2">
              <Link
                to="/forgot-password"
                className="block text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
              >
                Esqueceu a senha?
              </Link>
              <Link
                to="/register"
                className="block text-primary-600 dark:text-primary-400 hover:underline"
              >
                Não tem conta? Registe-se
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Login com QR Code
            </h3>
            <div className="bg-gray-200 dark:bg-gray-700 h-64 flex items-center justify-center rounded-lg mb-4">
              <p className="text-gray-500 dark:text-gray-400">
                Escaneie o QR Code
              </p>
            </div>
            <Button onClick={handleQRLogin} fullWidth className="mb-4" loading={loading}>
              Simular Login com QR
            </Button>
            <Button
              variant="secondary"
              fullWidth
              onClick={() => setShowQRLogin(false)}
              disabled={loading}
            >
              Voltar ao Login Normal
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;