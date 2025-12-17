import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Avatar from '../components/Avatar';
import { toast } from 'react-toastify';
import api from '../services/api';
import QRCode from 'qrcode.react';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showQRCode, setShowQRCode] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put('/users/profile', formData);
      updateUser(response.data);
      toast.success('Perfil atualizado com sucesso');
      setEditMode(false);
    } catch (error) {
      toast.error('Erro ao atualizar perfil');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('As passwords não coincidem');
      return;
    }

    try {
      await api.put('/users/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success('Password alterada com sucesso');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error('Erro ao alterar password');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await api.post('/users/upload-avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      updateUser({ avatar: response.data.avatar });
      toast.success('Imagem atualizada com sucesso');
    } catch (error) {
      toast.error('Erro ao fazer upload da imagem');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Perfil
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Informações do utilizador */}
        <Card className="md:col-span-1">
          <div className="flex flex-col items-center">
            <Avatar src={user?.avatar} name={user?.name} size="xl" />
            
            <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
              {user?.name}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">{user?.email}</p>
            <p className="text-sm text-primary-600 dark:text-primary-400 mt-2">
              {user?.role === 'admin' && 'Administrador'}
              {user?.role === 'trainer' && 'Personal Trainer'}
              {user?.role === 'client' && 'Cliente'}
            </p>

            <label className="mt-4 cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button size="sm">Alterar Foto</Button>
            </label>

            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => setShowQRCode(!showQRCode)}
            >
              {showQRCode ? 'Ocultar QR Code' : 'Mostrar QR Code'}
            </Button>

            {showQRCode && (
              <div className="mt-4 p-4 bg-white rounded-lg">
                <QRCode value={user?._id || ''} size={150} />
                <p className="text-xs text-center mt-2 text-gray-500">
                  Use para login rápido
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Edição de perfil */}
        <Card className="md:col-span-2" title="Informações Pessoais">
          {!editMode ? (
            <div>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Nome</label>
                  <p className="text-gray-900 dark:text-white">{user?.name}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Email</label>
                  <p className="text-gray-900 dark:text-white">{user?.email}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Username</label>
                  <p className="text-gray-900 dark:text-white">{user?.username}</p>
                </div>
              </div>
              <Button onClick={() => setEditMode(true)}>Editar Perfil</Button>
            </div>
          ) : (
            <form onSubmit={handleUpdateProfile}>
              <Input
                label="Nome"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <div className="flex gap-2">
                <Button type="submit">Salvar</Button>
                <Button type="button" variant="secondary" onClick={() => setEditMode(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          )}

          <hr className="my-6 border-gray-300 dark:border-gray-600" />

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Alterar Password
          </h3>
          <form onSubmit={handleChangePassword}>
            <Input
              label="Password Atual"
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              required
            />
            <Input
              label="Nova Password"
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              required
            />
            <Input
              label="Confirmar Nova Password"
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              required
            />
            <Button type="submit">Alterar Password</Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
