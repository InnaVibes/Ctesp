import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
const { Message } = require('../models/Message');
const { User } = require('../models/User');

// Enviar mensagem
export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { conversationId, receiverId, content } = req.body;
    const senderId = req.user?._id;

    console.log('📨 Enviando mensagem:', { conversationId, senderId, receiverId, content });

    if (!conversationId || !receiverId || !content) {
      return res.status(400).json({ message: 'conversationId, receiverId e content são obrigatórios' });
    }

    // Criar mensagem
    const message = new Message({
      conversationId,
      senderId,
      receiverId,
      content,
      read: false
    });

    await message.save();

    // Popular informações do sender e receiver
    await message.populate('senderId', 'username email profileImage role');
    await message.populate('receiverId', 'username email profileImage role');

    console.log('✅ Mensagem enviada com sucesso');
    res.status(201).json(message);
  } catch (err) {
    console.error('❌ Erro ao enviar mensagem:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Obter mensagens de uma conversa
export const getMessages = async (req: AuthRequest, res: Response) => {
  try {
    const { conversationId } = req.params;
    const { limit = '50', before } = req.query;

    console.log('📬 Buscando mensagens da conversa:', conversationId);

    const query: any = { conversationId };
    
    // Se tiver paginação
    if (before && typeof before === 'string') {
      query.createdAt = { $lt: new Date(before) };
    }

    const messages = await Message.find(query)
      .populate('senderId', 'username email profileImage role')
      .populate('receiverId', 'username email profileImage role')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit as string));

    console.log(`✅ ${messages.length} mensagens encontradas`);
    
    // Retornar em ordem cronológica (mais antiga primeiro)
    res.json(messages.reverse());
  } catch (err) {
    console.error('❌ Erro ao buscar mensagens:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Obter conversas do usuário
export const getConversations = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;

    console.log('💬 Buscando conversas do usuário:', userId);

    // Buscar todas as mensagens onde o usuário é sender ou receiver
    const messages = await Message.find({
      $or: [
        { senderId: userId },
        { receiverId: userId }
      ]
    })
      .populate('senderId', 'username email profileImage role')
      .populate('receiverId', 'username email profileImage role')
      .sort({ createdAt: -1 })
      .lean(); // Converter para objeto JS puro

    // Agrupar por conversationId e pegar a última mensagem
    const conversationsMap = new Map();

    messages.forEach((msg: any) => {
      if (!conversationsMap.has(msg.conversationId)) {
        // Determinar quem é o "outro usuário"
        const isSender = msg.senderId._id.toString() === userId.toString();
        const otherUser = isSender ? msg.receiverId : msg.senderId;

        // Validar que otherUser tem dados completos
        if (!otherUser || !otherUser._id) {
          console.warn('⚠️ Mensagem sem otherUser válido:', msg._id);
          return;
        }

        // Contar mensagens não lidas
        const unreadCount = messages.filter((m: any) => 
          m.conversationId === msg.conversationId && 
          m.receiverId && 
          m.receiverId._id &&
          m.receiverId._id.toString() === userId.toString() && 
          !m.read
        ).length;

        conversationsMap.set(msg.conversationId, {
          _id: msg.conversationId,
          otherUser: {
            _id: otherUser._id,
            username: otherUser.username,
            email: otherUser.email,
            profileImage: otherUser.profileImage,
            role: otherUser.role
          },
          lastMessage: {
            content: msg.content,
            createdAt: msg.createdAt,
            senderId: msg.senderId._id
          },
          unreadCount,
          updatedAt: msg.createdAt
        });
      }
    });

    const conversations = Array.from(conversationsMap.values())
      .sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    
    console.log(`✅ ${conversations.length} conversas encontradas`);

    res.json(conversations);
  } catch (err) {
    console.error('❌ Erro ao buscar conversas:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Marcar mensagens como lidas
export const markAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user?._id;

    console.log('✓ Marcando mensagens como lidas:', conversationId);

    // Marcar todas as mensagens da conversa como lidas
    const result = await Message.updateMany(
      {
        conversationId,
        receiverId: userId,
        read: false
      },
      {
        read: true
      }
    );

    console.log(`✅ ${result.modifiedCount} mensagens marcadas como lidas`);
    res.json({ success: true, modifiedCount: result.modifiedCount });
  } catch (err) {
    console.error('❌ Erro ao marcar mensagens:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Criar ou obter conversa
export const createConversation = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.body;
    const currentUserId = req.user?._id;

    console.log('🆕 Criando/obtendo conversa entre:', currentUserId, 'e', userId);

    // Verificar se usuário existe
    const otherUser = await User.findById(userId).select('-password').lean();
    if (!otherUser) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Criar ID de conversa (sempre ordenado para garantir unicidade)
    const userIds = [currentUserId.toString(), userId.toString()].sort();
    const conversationId = `${userIds[0]}_${userIds[1]}`;

    console.log('✅ Conversa criada/obtida:', conversationId);
    
    res.json({
      _id: conversationId,
      otherUser: {
        _id: otherUser._id,
        username: otherUser.username,
        email: otherUser.email,
        profileImage: otherUser.profileImage,
        role: otherUser.role
      }
    });
  } catch (err) {
    console.error('❌ Erro ao criar conversa:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};