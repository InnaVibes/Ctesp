import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { User } from '../models/User';

// Buscar usuário por email ou username (case-insensitive)
export const searchUser = async (req: AuthRequest, res: Response) => {
  try {
    const { query } = req.query;
    
    console.log('🔍 Buscando usuário com query:', query);
    
    if (!query || typeof query !== 'string') {
      console.log('❌ Query inválida');
      return res.status(400).json({ message: 'Query parameter is required' });
    }

    // Buscar por username ou email (case-insensitive)
    const user = await User.findOne({
      $or: [
        { username: { $regex: new RegExp(`^${query}$`, 'i') } },
        { email: { $regex: new RegExp(`^${query}$`, 'i') } }
      ]
    }).select('-password'); // Não retornar a senha

    if (!user) {
      console.log('❌ Usuário não encontrado');
      // Vamos listar todos os usernames para debug
      const allUsers = await User.find().select('username email').lean();
      console.log('📋 Usuários disponíveis:', allUsers);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('✅ Usuário encontrado:', (user as any).username);
    res.json(user);
  } catch (err) {
    console.error('❌ Erro ao buscar usuário:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Listar todos os usuários (para admin ou para busca)
export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error('❌ Erro ao listar usuários:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};