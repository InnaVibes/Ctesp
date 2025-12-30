import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { User } from '../models/User';
import bcrypt from 'bcryptjs';
import { Types } from 'mongoose';

// Pesquisar utilizador por nome ou email
export const searchUser = async (req: AuthRequest, res: Response) => {
    try {
        const { query } = req.query;
        if (!query || typeof query !== 'string') {
          return res.status(400).json({ message: 'Parâmetro de pesquisa obrigatório' });
        }
        const user = await User.findOne({
          $or: [
            { username: { $regex: new RegExp(`^${query}$`, 'i') } },
            { email: { $regex: new RegExp(`^${query}$`, 'i') } }
          ]
        }).select('-password');
    
        if (!user) return res.status(404).json({ message: 'Utilizador não encontrado' });
        res.json(user);
      } catch (err) {
        res.status(500).json({ error: 'Erro interno no servidor' });
      }
};

export const getAllUsers = async (req: AuthRequest, res: Response) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
      } catch (err) {
        res.status(500).json({ error: 'Erro interno no servidor' });
      }
};

// ADMIN: Listar PTs pendentes de validação
export const getPendingPTs = async (req: AuthRequest, res: Response) => {
  try {
    const pendingPTs = await User.find({ role: 'PT', isValidated: false }).select('-password');
    res.json(pendingPTs);
  } catch (err) {
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
};

// ADMIN: Validar (Aprovar) um PT
export const validateUser = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { isValidated: true },
      { new: true } 
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'Utilizador não encontrado' });
    }

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
};

// ADMIN: Remover um utilizador
export const deleteUser = async (req: AuthRequest, res: Response) => {
    try {
        const { userId } = req.params;
        await User.findByIdAndDelete(userId);
        res.json({ message: "Utilizador removido com sucesso" });
    } catch (err) {
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
};

// ADMIN: Alterar o PT de um cliente
export const adminChangePt = async (req: AuthRequest, res: Response) => {
  try {
      const { userId, newPtId } = req.body;
      
      const newPt = await User.findById(newPtId);
      if (!newPt || newPt.role !== 'PT') {
          return res.status(400).json({ message: "ID do novo Personal Trainer inválido." });
      }

      const user = await User.findByIdAndUpdate(
          userId, 
          { ptId: newPtId },
          { new: true }
      ).select('-password');

      res.json({ message: "Personal Trainer alterado com sucesso.", user });
  } catch (err) {
      res.status(500).json({ error: "Erro ao alterar PT." });
  }
};

// PT: Obter os seus clientes
export const getMyClients = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Não autenticado' });
    }

    const ptId = req.user._id;
    const clients = await User.find({ ptId: ptId }).select('-password');
    res.json(clients);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar clientes associados.' });
  }
};

// GENÉRICO: Atualizar o próprio perfil
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
      if (!req.user || !req.user._id) {
        return res.status(401).json({ message: 'Não autenticado' });
      }

      const updates = req.body;
      const allowedUpdates = ['username', 'profileImage', 'themePreference'];
      
      const filteredUpdates = Object.keys(updates)
          .filter(key => allowedUpdates.includes(key))
          .reduce((obj, key) => {
              obj[key] = updates[key];
              return obj;
          }, {} as Record<string, any>);

      const user = await User.findByIdAndUpdate(
          req.user._id, 
          filteredUpdates, 
          { new: true }
      ).select('-password');
      
      res.json(user);
  } catch (err) {
      res.status(500).json(err);
  }
};

// Cliente solicita PT
export const requestPT = async (req: AuthRequest, res: Response) => {
  try {
    const { ptId } = req.body;

    if (!req.user || req.user.role !== 'CLIENT') {
      return res.status(403).json({ message: 'Apenas clientes podem solicitar PT' });
    }

    const pt = await User.findById(ptId);
    if (!pt || pt.role !== 'PT') {
      return res.status(404).json({ message: 'PT não encontrado' });
    }

    if (!pt.isValidated) {
      return res.status(400).json({ message: 'Este PT ainda não foi validado' });
    }

    const client = await User.findById(req.user._id);
    if (!client) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }

    client.ptId = new Types.ObjectId(req.user._id);
    await client.save();

    res.json({ message: 'PT atribuído com sucesso', client });
  } catch (err) {
    console.error('Erro ao solicitar PT:', err);
    res.status(500).json({ error: 'Erro ao solicitar PT' });
  }
};

// Listar PTs validados disponíveis
export const getAvailablePTs = async (req: AuthRequest, res: Response) => {
  try {
    const pts = await User.find({ 
      role: 'PT', 
      isValidated: true 
    }).select('username email profileImage');

    res.json(pts);
  } catch (err) {
    console.error('Erro ao buscar PTs:', err);
    res.status(500).json({ error: 'Erro ao buscar PTs' });
  }
};

// PT adiciona cliente manualmente (via registro)
export const addClientByPT = async (req: AuthRequest, res: Response) => {
  try {
    const { username, password, email } = req.body;

    if (!req.user || req.user.role !== 'PT') {
      return res.status(403).json({ message: 'Apenas PTs podem adicionar clientes' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username já existe' });
    }

    if (email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ message: 'Email já está registado' });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newClient = new User({
      username,
      password: hashedPassword,
      email,
      role: 'CLIENT',
      ptId: new Types.ObjectId(req.user._id),
      isValidated: true,
    });

    await newClient.save();

    const { password: _, ...clientResponse } = newClient.toObject();

    res.status(201).json(clientResponse);
  } catch (err) {
    console.error('Erro ao adicionar cliente:', err);
    res.status(500).json({ error: 'Erro ao adicionar cliente' });
  }
};

// PT atribui cliente existente a si mesmo
export const assignExistingClient = async (req: AuthRequest, res: Response) => {
  try {
    const { clientId } = req.body;

    if (!req.user || req.user.role !== 'PT') {
      return res.status(403).json({ message: 'Apenas PTs podem atribuir clientes' });
    }

    const client = await User.findById(clientId);
    if (!client) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }

    if (client.role !== 'CLIENT') {
      return res.status(400).json({ message: 'Este utilizador não é um cliente' });
    }

    client.ptId = new Types.ObjectId(req.user._id);
    await client.save();

    const { password: _, ...clientResponse } = client.toObject();

    res.json({ message: 'Cliente atribuído com sucesso', client: clientResponse });
  } catch (err) {
    console.error('Erro ao atribuir cliente:', err);
    res.status(500).json({ error: 'Erro ao atribuir cliente' });
  }
};