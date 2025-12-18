import { Router } from 'express';
import { login, register, qrLogin } from '../controllers/auth.controller';
import { createPlan, getPlans, completeWorkout } from '../controllers/plan.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { sendMessage, getMessages, getConversations, markAsRead, createConversation } from '../controllers/message.controller';

// Importar controllers de usuário
const { searchUser, getAllUsers } = require('../controllers/user.controller');

const router = Router();

// ========== ROTAS DE AUTENTICAÇÃO ==========
router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/qr-login', qrLogin);

// ========== ROTAS DE PLANOS DE TREINO ==========
router.post('/plans', authenticate, authorize(['PT']), createPlan);
router.get('/plans', authenticate, getPlans);
router.post('/plans/:id/complete', authenticate, completeWorkout);

// ========== ROTAS DE USUÁRIOS ==========
router.get('/users/search', authenticate, searchUser);
router.get('/users', authenticate, getAllUsers);

// ========== ROTAS DE MENSAGENS ==========
// Criar ou obter conversa
router.post('/messages/conversations', authenticate, createConversation);

// Obter lista de conversas
router.get('/messages/conversations', authenticate, getConversations);

// Enviar mensagem
router.post('/messages', authenticate, sendMessage);

// Obter mensagens de uma conversa
router.get('/messages/conversation/:conversationId', authenticate, getMessages);

// Marcar mensagens como lidas
router.put('/messages/conversation/:conversationId/read', authenticate, markAsRead);

// ========== ROTA ADMIN ==========
router.get('/admin/users', authenticate, authorize(['ADMIN']), (req, res) => {
    res.json({ message: "Admin access granted" });
});

export default router;