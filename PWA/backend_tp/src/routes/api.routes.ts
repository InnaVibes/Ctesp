import { Router } from 'express';
import { login, register, qrLogin } from '../controllers/auth.controller';
import { createPlan, getPlans, completeWorkout, getDashboardStats } from '../controllers/plan.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { sendMessage, getMessages, getConversations, markAsRead, createConversation } from '../controllers/message.controller';
import { 
    searchUser, 
    getAllUsers, 
    getPendingPTs, 
    validateUser, 
    deleteUser,
    getMyClients,
    adminChangePt,
    updateProfile 
} from '../controllers/User.controller';

const router = Router();

// ========== AUTENTICAÇÃO ==========
router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/qr-login', qrLogin);

// ========== PLANOS DE TREINO ==========
router.post('/plans', authenticate, authorize(['PT']), createPlan);
router.get('/plans', authenticate, getPlans);
router.post('/plans/:id/complete', authenticate, completeWorkout);
router.get('/plans/stats', authenticate, getDashboardStats);

// ========== USUÁRIOS ==========
router.get('/users/search', authenticate, searchUser);
router.get('/users', authenticate, getAllUsers);
router.get('/users/my-clients', authenticate, authorize(['PT']), getMyClients);
router.put('/users/profile', authenticate, updateProfile); 

// ========== MENSAGENS (CHAT) ==========
router.post('/messages/conversations', authenticate, createConversation);
router.get('/messages/conversations', authenticate, getConversations);
router.post('/messages', authenticate, sendMessage);
router.get('/messages/conversation/:conversationId', authenticate, getMessages);
router.put('/messages/conversation/:conversationId/read', authenticate, markAsRead);

// ========== ADMINISTRAÇÃO ==========
router.get('/admin/pending-pts', authenticate, authorize(['ADMIN']), getPendingPTs);
router.patch('/admin/users/:userId/validate', authenticate, authorize(['ADMIN']), validateUser);
router.patch('/admin/users/change-pt', authenticate, authorize(['ADMIN']), adminChangePt);
router.delete('/admin/users/:userId', authenticate, authorize(['ADMIN']), deleteUser);
router.get('/admin/users', authenticate, authorize(['ADMIN']), getAllUsers);

export default router;