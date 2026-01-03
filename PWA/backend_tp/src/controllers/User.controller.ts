import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { User, IUser } from '../models/User';
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

    // Se cliente tinha um PT anterior, decrementar (mas não deixar negativo)
    if (client.ptId && client.ptId.toString() !== '000000000000000000000000') {
      const oldPT = await User.findById(client.ptId);
      const newCount = Math.max(0, (oldPT?.clientCount || 0) - 1);
      await User.findByIdAndUpdate(client.ptId, { clientCount: newCount });
    }

    // Incrementar novo PT
    client.ptId = new Types.ObjectId(ptId);
    const newPT = await User.findById(ptId);
    const newClientCount = (newPT?.clientCount || 0) + 1;
    await User.findByIdAndUpdate(ptId, { clientCount: newClientCount });

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
    }).select('username email profileImage clientCount');

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

    // Incrementar clientCount do PT
    const pt = await User.findById(req.user._id);
    const newClientCount = (pt?.clientCount || 0) + 1;
    await User.findByIdAndUpdate(req.user._id, { clientCount: newClientCount });

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

    // Se cliente tinha um PT anterior, decrementar (mas não deixar negativo)
    if (client.ptId && client.ptId.toString() !== '000000000000000000000000') {
      const oldPT = await User.findById(client.ptId);
      const newCount = Math.max(0, (oldPT?.clientCount || 0) - 1);
      await User.findByIdAndUpdate(client.ptId, { clientCount: newCount });
    }

    // Incrementar novo PT
    const newPTId = new Types.ObjectId(req.user._id);
    client.ptId = newPTId;
    
    const newPT = await User.findById(newPTId);
    const newClientCount = (newPT?.clientCount || 0) + 1;
    await User.findByIdAndUpdate(newPTId, { clientCount: newClientCount });

    await client.save();

    const { password: _, ...clientResponse } = client.toObject();

    res.json({ message: 'Cliente atribuído com sucesso', client: clientResponse });
  } catch (err) {
    console.error('Erro ao atribuir cliente:', err);
    res.status(500).json({ error: 'Erro ao atribuir cliente' });
  }
};

// ============================================================================
// CLIENTE SOLICITA MUDANÇA DE PT
// ============================================================================

export const requestPTChange = async (req: AuthRequest, res: Response) => {
  try {
    const { newPtId } = req.body;
    
    if (!req.user) {
      return res.status(401).json({ message: 'Não autenticado' });
    }
    
    const client = await User.findById(req.user._id);
    if (!client) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }

    // newPtId pode ser undefined para "Nenhum PT"
    if (newPtId) {
      const newPt = await User.findById(newPtId);
      if (!newPt || newPt.role !== 'PT') {
        return res.status(404).json({ message: 'PT não encontrado' });
      }
    }

    if (!client.ptChangeRequests) {
      client.ptChangeRequests = [];
    }

    const existingPending = client.ptChangeRequests.some(
      (r) => r.status === 'pending'
    );
    
    if (existingPending) {
      return res.status(400).json({
        message: 'Você já tem um pedido pendente de aprovação. Aguarde a resposta.',
      });
    }

    const fromPTId = client.ptId || new Types.ObjectId('000000000000000000000000');
    
    // Se newPtId é undefined, usar um ObjectId especial para "Nenhum PT"
    const toPTId = newPtId 
      ? new Types.ObjectId(newPtId)
      : new Types.ObjectId('000000000000000000000000');

    const ptChangeRequest: any = {
      _id: new Types.ObjectId(),
      fromPT: fromPTId,
      toPT: toPTId,
      status: 'pending',
      requestedAt: new Date(),
    };

    client.ptChangeRequests.push(ptChangeRequest);

    await client.save();

    console.log(
      `[PT CHANGE REQUEST] Cliente: ${client.username}, Novo PT: ${newPtId ? 'Outro PT' : 'Nenhum'}`
    );

    return res.status(201).json({
      message: 'Solicitação de mudança de PT enviada para aprovação',
      requestId: ptChangeRequest._id,
    });
  } catch (error) {
    console.error('Erro em requestPTChange:', error);
    res.status(500).json({ message: 'Erro ao solicitar mudança de PT', error });
  }
};
// ============================================================================
// PT VISUALIZA PEDIDOS FEITOS PARA ELE
// ============================================================================

export const getPTChangeRequestsForMe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'PT') {
      return res.status(403).json({ message: 'Apenas PTs podem acessar' });
    }

    const ptId = req.user._id;

    const clientsWithRequests = await User.find({
      'ptChangeRequests.status': 'pending',
      'ptChangeRequests.toPT': new Types.ObjectId(ptId),
    })
      .select('_id username email ptChangeRequests')
      .lean();

    const formattedRequests = [];

    for (const client of clientsWithRequests) {
      if (!client.ptChangeRequests) continue;

      const pendingReqs = client.ptChangeRequests.filter(
        (r) => r.status === 'pending' && r.toPT.toString() === ptId.toString()
      );

      for (const req of pendingReqs) {
        const oldPt =
          req.fromPT && req.fromPT.toString() !== '000000000000000000000000'
            ? await User.findById(req.fromPT).select('username').lean()
            : null;

        formattedRequests.push({
          _id: req._id,
          clientId: client._id,
          clientName: client.username,
          clientEmail: client.email,
          fromPT: oldPt?.username || 'Sem PT',
          requestedAt: req.requestedAt,
          status: req.status,
        });
      }
    }

    return res.json(formattedRequests);
  } catch (error) {
    console.error('Erro em getPTChangeRequestsForMe:', error);
    res.status(500).json({ message: 'Erro ao listar pedidos', error });
  }
};

// ============================================================================
// ADMIN APROVA OU REJEITA PEDIDO
// ============================================================================

export const respondToPTChangeRequest = async (req: AuthRequest, res: Response) => {
  try {
    const { requestId } = req.params;
    const { action, reason } = req.body;
    
    if (!req.user) {
      return res.status(401).json({ message: 'Não autenticado' });
    }
    
    const adminId = req.user._id;

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({ message: 'Ação deve ser approve ou reject' });
    }

    const client = await User.findOne({
      'ptChangeRequests._id': new Types.ObjectId(requestId),
    });

    if (!client) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }

    if (!client.ptChangeRequests) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }

    const requestIndex = client.ptChangeRequests.findIndex(
      (r) => r._id?.toString() === requestId
    );

    if (requestIndex === -1) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }

    const ptRequest = client.ptChangeRequests[requestIndex];

    if (ptRequest.status !== 'pending') {
      return res.status(400).json({
        message: 'Este pedido já foi respondido anteriormente',
      });
    }

    if (action === 'approve') {
      const oldPTId = client.ptId;
      
      // Se toPT é "000000000000000000000000", significa "Nenhum PT"
      const isRemovingPT = ptRequest.toPT.toString() === '000000000000000000000000';
      
      if (!isRemovingPT) {
        // Está a atribuir a um PT novo
        client.ptId = ptRequest.toPT;
        await User.findByIdAndUpdate(ptRequest.toPT, {
          $inc: { clientCount: 1 },
        });
      } else {
        // Está a remover o PT - usar undefined em vez de null
        client.ptId = undefined;
      }

      ptRequest.status = 'approved';

      // Decrementar PT anterior se existia
      if (
        oldPTId &&
        oldPTId.toString() !== '000000000000000000000000'
      ) {
        const oldPT = await User.findById(oldPTId);
        const newCount = Math.max(0, (oldPT?.clientCount || 0) - 1);
        await User.findByIdAndUpdate(oldPTId, {
          clientCount: newCount,
        });
      }

      console.log(
        `[PT CHANGE APPROVED] Cliente: ${client.username}, Novo PT: ${isRemovingPT ? 'Nenhum' : ptRequest.toPT}`
      );
    } else if (action === 'reject') {
      ptRequest.status = 'rejected';

      console.log(
        `[PT CHANGE REJECTED] Cliente: ${client.username}, Razão: ${reason}`
      );
    }

    ptRequest.respondedAt = new Date();
    ptRequest.respondedBy = new Types.ObjectId(adminId);
    if (reason) {
      ptRequest.reason = reason;
    }

    client.pendingPTChange = undefined;

    await client.save();

    return res.json({
      message: `Pedido ${
        action === 'approve' ? 'aprovado' : 'rejeitado'
      } com sucesso`,
      requestId: ptRequest._id,
      status: ptRequest.status,
    });
  } catch (error) {
    console.error('Erro em respondToPTChangeRequest:', error);
    res.status(500).json({ message: 'Erro ao responder pedido', error });
  }
};

// ============================================================================
// ADMIN LISTA TODOS OS PEDIDOS PENDENTES
// ============================================================================

export const getPendingPTChangeRequests = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const clientsWithRequests = await User.find({
      'ptChangeRequests.status': 'pending',
    })
      .select('_id username email ptChangeRequests')
      .lean();

    const formattedRequests = [];

    for (const client of clientsWithRequests) {
      if (!client.ptChangeRequests) continue;
      
      const pendingReqs = client.ptChangeRequests.filter(
        (r) => r.status === 'pending'
      );

      for (const req of pendingReqs) {
        // Verificar se é "Nenhum PT"
        const isNoPT = req.toPT.toString() === '000000000000000000000000';
        
        let newPt = null;
        if (!isNoPT) {
          newPt = await User.findById(req.toPT).select('username').lean();
        }
        
        const oldPt =
          req.fromPT && req.fromPT.toString() !== '000000000000000000000000'
            ? await User.findById(req.fromPT).select('username').lean()
            : null;

        formattedRequests.push({
          _id: req._id,
          clientId: client._id,
          clientName: client.username,
          clientEmail: client.email,
          fromPT: oldPt?.username || 'Sem PT (Novo cliente)',
          toPT: isNoPT ? 'Nenhum PT' : (newPt?.username || 'PT desconhecido'),
          requestedAt: req.requestedAt,
          status: req.status,
        });
      }
    }

    return res.json(formattedRequests);
  } catch (error) {
    console.error('Erro em getPendingPTChangeRequests:', error);
    res.status(500).json({ message: 'Erro ao listar pedidos', error });
  }
};

// ============================================================================
// CLIENTE CANCELA PEDIDO PENDENTE
// ============================================================================

export const cancelPTChangeRequest = async (req: AuthRequest, res: Response) => {
  try {
    const { requestId } = req.params;
    
    if (!req.user) {
      return res.status(401).json({ message: 'Não autenticado' });
    }
    
    const clientId = req.user._id;

    const client = await User.findById(clientId);

    if (!client) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }

    if (!client.ptChangeRequests) {
      return res.status(404).json({
        message: 'Nenhum pedido encontrado',
      });
    }

    const requestIndex = client.ptChangeRequests.findIndex(
      (r) =>
        r._id?.toString() === requestId && r.status === 'pending'
    );

    if (requestIndex === -1 || requestIndex === undefined) {
      return res.status(404).json({
        message: 'Pedido não encontrado ou já foi respondido',
      });
    }

    client.ptChangeRequests.splice(requestIndex, 1);
    client.pendingPTChange = undefined;

    await client.save();

    console.log(
      `[PT CHANGE CANCELLED] Cliente: ${client.username}, RequestId: ${requestId}`
    );

    return res.json({ message: 'Solicitação de mudança cancelada' });
  } catch (error) {
    console.error('Erro em cancelPTChangeRequest:', error);
    res.status(500).json({ message: 'Erro ao cancelar pedido', error });
  }
};

// ============================================================================
// CLIENTE VISUALIZA SEU HISTÓRICO DE PEDIDOS
// ============================================================================

export const getMyPTChangeHistory = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Não autenticado' });
    }
    
    const clientId = req.user._id;

    const client = await User.findById(clientId).select('ptChangeRequests');

    if (!client) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }

    if (!client.ptChangeRequests) {
      return res.json([]);
    }

    const enrichedHistory = await Promise.all(
      client.ptChangeRequests.map(async (req) => {
        // Verificar se é "Nenhum PT"
        const isNoPT = req.toPT.toString() === '000000000000000000000000';
        
        let newPt = null;
        if (!isNoPT) {
          newPt = await User.findById(req.toPT)
            .select('username')
            .lean();
        }
        
        const oldPt =
          req.fromPT && req.fromPT.toString() !== '000000000000000000000000'
            ? await User.findById(req.fromPT).select('username').lean()
            : null;

        return {
          _id: req._id,
          fromPT: oldPt?.username || 'Sem PT',
          toPT: isNoPT ? 'Nenhum PT' : (newPt?.username || 'PT desconhecido'),
          status: req.status,
          requestedAt: req.requestedAt,
          respondedAt: req.respondedAt,
          reason: req.reason,
        };
      })
    );

    return res.json(enrichedHistory);
  } catch (error) {
    console.error('Erro em getMyPTChangeHistory:', error);
    res.status(500).json({ message: 'Erro ao buscar histórico', error });
  }
};
// ============================================================================
// REQUEST CLIENT (PT pede cliente existente - usando padrão ptChangeRequests)
// ============================================================================
export const requestClient = async (req: AuthRequest, res: Response) => {
  try {
    const ptId = req.user?._id;
    const { clientId } = req.body;

    if (!ptId) {
      return res.status(401).json({ message: 'Não autenticado' });
    }

    if (!clientId) {
      return res.status(400).json({ message: 'ID do cliente é obrigatório' });
    }

    // Verificar se o cliente existe
    const client = await User.findById(clientId);
    if (!client) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }

    if (client.role !== 'CLIENT') {
      return res.status(400).json({ message: 'Este utilizador não é um cliente' });
    }

    // Verificar se o PT já tem este cliente
    if (client.ptId && client.ptId.toString() === ptId.toString()) {
      return res.status(400).json({ message: 'Já é o treinador deste cliente' });
    }

    // Inicializar array se não existir
    if (!client.clientRequestsFromPTs) {
      client.clientRequestsFromPTs = [];
    }

    // Verificar se já existe um pedido pendente deste PT
    const existingRequest = client.clientRequestsFromPTs.some(
      (r) => r.ptId.toString() === ptId.toString() && r.status === 'pending'
    );

    if (existingRequest) {
      return res.status(400).json({ message: 'Já existe um pedido pendente para este cliente' });
    }

    // Criar novo pedido
    const clientRequest: any = {
      _id: new Types.ObjectId(),
      ptId: new Types.ObjectId(ptId),
      status: 'pending',
      requestedAt: new Date(),
    };

    client.clientRequestsFromPTs.push(clientRequest);
    await client.save();

    res.status(201).json({
      success: true,
      message: 'Pedido enviado com sucesso. Aguardando confirmação do administrador.',
      data: clientRequest
    });

  } catch (error: any) {
    console.error('Erro ao pedir cliente:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao enviar pedido',
      error: error.message
    });
  }
};

// ============================================================================
// GET MY CLIENT REQUESTS (PT vê seus pedidos)
// ============================================================================
export const getMyClientRequests = async (req: AuthRequest, res: Response) => {
  try {
    const ptId = req.user?._id;

    if (!ptId) {
      return res.json({
        success: true,
        stats: { total: 0, pending: 0, approved: 0, rejected: 0 },
        data: []
      });
    }

    // Buscar todos os clientes que têm pedidos deste PT
    const clientsWithRequests = await User.find({
      'clientRequestsFromPTs.ptId': new Types.ObjectId(ptId)
    })
      .select('_id username email profileImage clientRequestsFromPTs')
      .lean();

    const requests = [];

    for (const client of clientsWithRequests) {
      if (!client.clientRequestsFromPTs) continue;

      const myRequests = client.clientRequestsFromPTs.filter(
        (r) => r.ptId.toString() === ptId.toString()
      );

      for (const req of myRequests) {
        requests.push({
          _id: req._id,
          clientId: client._id,
          clientName: client.username,
          clientEmail: client.email,
          clientImage: client.profileImage,
          status: req.status,
          requestedAt: req.requestedAt,
          respondedAt: req.respondedAt
        });
      }
    }

    const stats = {
      total: requests.length,
      pending: requests.filter(r => r.status === 'pending').length,
      approved: requests.filter(r => r.status === 'approved').length,
      rejected: requests.filter(r => r.status === 'rejected').length
    };

    return res.json({
      success: true,
      stats,
      data: requests
    });

  } catch (error: any) {
    console.error('Erro ao buscar meus pedidos:', error);
    return res.json({
      success: true,
      stats: { total: 0, pending: 0, approved: 0, rejected: 0 },
      data: []
    });
  }
};

// ============================================================================
// GET PENDING CLIENT REQUESTS (ADMIN vê todos os pedidos pendentes)
// ============================================================================
export const getPendingClientRequests = async (req: AuthRequest, res: Response) => {
  try {
    // Buscar todos os clientes que têm pedidos pendentes
    const clientsWithRequests = await User.find({
      'clientRequestsFromPTs.status': 'pending'
    })
      .select('_id username email profileImage clientRequestsFromPTs')
      .lean();

    const requests = [];

    for (const client of clientsWithRequests) {
      if (!client.clientRequestsFromPTs) continue;

      const pendingReqs = client.clientRequestsFromPTs.filter(
        (r) => r.status === 'pending'
      );

      for (const req of pendingReqs) {
        // Buscar dados do PT que fez o pedido
        const pt = await User.findById(req.ptId)
          .select('username email profileImage')
          .lean();

        requests.push({
          _id: req._id,
          clientId: client._id,
          clientName: client.username,
          clientEmail: client.email,
          clientImage: client.profileImage,
          ptId: req.ptId,
          ptName: pt?.username || 'PT desconhecido',
          ptEmail: pt?.email,
          ptImage: pt?.profileImage,
          requestedAt: req.requestedAt,
          status: req.status
        });
      }
    }

    return res.json({
      success: true,
      total: requests.length,
      data: requests
    });

  } catch (error: any) {
    console.error('Erro ao buscar pedidos de cliente:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar pedidos',
      error: error.message
    });
  }
};

// ============================================================================
// RESPOND TO CLIENT REQUEST (ADMIN aprova ou rejeita)
// ============================================================================
export const respondToClientRequest = async (req: AuthRequest, res: Response) => {
  try {
    const { requestId } = req.params;
    const { status, rejectionReason } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status inválido. Use: approved ou rejected' });
    }

    // Encontrar o cliente que tem este pedido
    const client = await User.findOne({
      'clientRequestsFromPTs._id': new Types.ObjectId(requestId)
    });

    if (!client) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }

    if (!client.clientRequestsFromPTs) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }

    const requestIndex = client.clientRequestsFromPTs.findIndex(
      (r) => r._id?.toString() === requestId
    );

    if (requestIndex === -1) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }

    const clientRequest = client.clientRequestsFromPTs[requestIndex];

    if (clientRequest.status !== 'pending') {
      return res.status(400).json({ message: 'Este pedido já foi respondido' });
    }

    clientRequest.status = status;
    clientRequest.respondedAt = new Date();

    if (status === 'rejected' && rejectionReason) {
      clientRequest.rejectionReason = rejectionReason;
    }

    // Se aprovado, atualizar o cliente para ter este PT
    if (status === 'approved') {
      const oldPtId = client.ptId;
      client.ptId = new Types.ObjectId(clientRequest.ptId);

      // Decrementar PT anterior se existia
      if (oldPtId && oldPtId.toString() !== '000000000000000000000000') {
        const oldPT = await User.findById(oldPtId);
        const newCount = Math.max(0, (oldPT?.clientCount || 0) - 1);
        await User.findByIdAndUpdate(oldPtId, { clientCount: newCount });
      }

      // Incrementar novo PT
      const newPT = await User.findById(clientRequest.ptId);
      const newClientCount = (newPT?.clientCount || 0) + 1;
      await User.findByIdAndUpdate(clientRequest.ptId, { clientCount: newClientCount });

      console.log(
        `[CLIENT REQUEST APPROVED] Cliente: ${client.username}, PT: ${clientRequest.ptId}`
      );
    } else {
      console.log(
        `[CLIENT REQUEST REJECTED] Cliente: ${client.username}, Razão: ${rejectionReason}`
      );
    }

    await client.save();

    res.json({
      success: true,
      message: status === 'approved' 
        ? 'Pedido aprovado! Cliente atribuído ao PT.' 
        : 'Pedido rejeitado com sucesso.',
      data: clientRequest
    });

  } catch (error: any) {
    console.error('Erro ao responder pedido:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao responder pedido',
      error: error.message
    });
  }
};