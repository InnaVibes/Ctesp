import { Router } from 'express';
import { 
    login, 
    register, 
    qrLogin, 
    forgotPassword, 
    validateResetToken, 
    resetPassword 
} from '../controllers/auth.controller';
import { 
  createPlan, 
  getPlans, 
  completeWorkout, 
  getDashboardStats,
  getRecentCompletions,
  getClientHistory,
  checkExpiredPlans,
  upload
} from '../controllers/plan.controller';
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
    updateProfile,
    requestPT,
    getAvailablePTs,
    addClientByPT,
    assignExistingClient
} from '../controllers/User.controller';
import {
  getAdminDashboard,
  getRecentActivity
} from '../controllers/admin.controller';

const router = Router();

// AUTH
router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/qr-login', qrLogin);
router.post('/auth/forgot-password', forgotPassword);
router.get('/auth/reset-password/:token', validateResetToken);
router.post('/auth/reset-password/:token', resetPassword);

// PLANS
router.post('/plans', authenticate, authorize(['PT']), createPlan);
router.get('/plans', authenticate, getPlans);
router.post('/plans/:id/complete', authenticate, upload.single('image'), completeWorkout);
router.get('/plans/stats', authenticate, getDashboardStats);
router.get('/plans/recent-completions', authenticate, authorize(['PT']), getRecentCompletions);
router.get('/plans/client-history/:clientId', authenticate, authorize(['PT']), getClientHistory);
router.post('/plans/check-expired', authenticate, authorize(['CLIENT']), checkExpiredPlans);

// USERS
router.get('/users/search', authenticate, searchUser);
router.get('/users', authenticate, getAllUsers);
router.get('/users/my-clients', authenticate, authorize(['PT']), getMyClients);
router.put('/users/profile', authenticate, updateProfile);
router.get('/users/available-pts', authenticate, getAvailablePTs);
router.post('/users/request-pt', authenticate, authorize(['CLIENT']), requestPT);
router.post('/users/add-client', authenticate, authorize(['PT']), addClientByPT);
router.post('/users/assign-client', authenticate, authorize(['PT']), assignExistingClient);

// MESSAGES
router.post('/messages/conversations', authenticate, createConversation);
router.get('/messages/conversations', authenticate, getConversations);
router.post('/messages', authenticate, sendMessage);
router.get('/messages/conversation/:conversationId', authenticate, getMessages);
router.put('/messages/conversation/:conversationId/read', authenticate, markAsRead);

// ADMIN
router.get('/admin/dashboard', authenticate, authorize(['ADMIN']), getAdminDashboard);
router.get('/admin/recent-activity', authenticate, authorize(['ADMIN']), getRecentActivity);
router.get('/admin/pending-pts', authenticate, authorize(['ADMIN']), getPendingPTs);
router.patch('/admin/users/:userId/validate', authenticate, authorize(['ADMIN']), validateUser);
router.patch('/admin/users/change-pt', authenticate, authorize(['ADMIN']), adminChangePt);
router.delete('/admin/users/:userId', authenticate, authorize(['ADMIN']), deleteUser);
router.get('/admin/users', authenticate, authorize(['ADMIN']), getAllUsers);

export default router;