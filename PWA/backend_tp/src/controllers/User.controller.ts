import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { User } from '../models/User';

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