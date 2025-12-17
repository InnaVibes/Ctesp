import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import Input from '../components/Input';
import Button from '../components/Button';
import { Html5QrcodeScanner } from 'html5-qrcode';

// Página de Login
const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const { login, loginWithQRCode } = useAuth();
  const navigate = useNavigate();

  // Handler de mudança de input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handler de submit do form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(formData.username, formData.password);

    if (result.success) {
      toast.success('Login realizado com sucesso!');
      navigate('/');
    } else {
      toast.error(result.message);
    }

    setLoading(false);
  };

  // Iniciar scanner de QR Code
  const startQRScanner = () => {
    setShowQRScanner(true);
    
    setTimeout(() => {
      const scanner = new Html5QrcodeScanner('qr-reader', {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      });

      scanner.render(
        async (decodedText) => {
          scanner.clear();
          setShowQRScanner(false);
          
          const result = await loginWithQRCode(decodedText);
          if (result.success) {
            toast.success('Login com QR Code realizado!');
            navigate('/');
          } else {
            toast.error(result.message);
          }
        },
        (error) => {
          console.error(error);
        }
      );
    }, 100);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
          Personal Trainer Platform
        </h2>

        {!showQRScanner ? (
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
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Digite sua password"
                required
              />

              <Button type="submit" fullWidth loading={loading}>
                Entrar
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Ou</span>
                </div>
              </div>

              <Button
                variant="outline"
                fullWidth
                onClick={startQRScanner}
                className="mt-4"
              >
                Login com QR Code
              </Button>
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/register"
                className="text-primary-600 dark:text-primary-400 hover:underline"
              >
                Não tem conta? Registe-se
              </Link>
            </div>
          </>
        ) : (
          <div>
            <h3 className="text-xl font-semibold text-center mb-4 text-gray-900 dark:text-white">
              Escanear QR Code
            </h3>
            <div id="qr-reader" className="mb-4"></div>
            <Button
              variant="secondary"
              fullWidth
              onClick={() => {
                setShowQRScanner(false);
                const scanner = document.getElementById('qr-reader');
                if (scanner) scanner.innerHTML = '';
              }}
            >
              Cancelar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
