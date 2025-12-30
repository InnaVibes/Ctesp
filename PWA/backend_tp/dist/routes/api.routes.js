"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const plan_controller_1 = require("../controllers/plan.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const message_controller_1 = require("../controllers/message.controller");
const User_controller_1 = require("../controllers/User.controller");
const admin_controller_1 = require("../controllers/admin.controller");
const router = (0, express_1.Router)();
// AUTH
router.post('/auth/register', auth_controller_1.register);
router.post('/auth/login', auth_controller_1.login);
router.post('/auth/qr-login', auth_controller_1.qrLogin);
router.post('/auth/forgot-password', auth_controller_1.forgotPassword);
router.get('/auth/reset-password/:token', auth_controller_1.validateResetToken);
router.post('/auth/reset-password/:token', auth_controller_1.resetPassword);
// PLANS
router.post('/plans', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['PT']), plan_controller_1.createPlan);
router.get('/plans', auth_middleware_1.authenticate, plan_controller_1.getPlans);
router.post('/plans/:id/complete', auth_middleware_1.authenticate, plan_controller_1.completeWorkout);
router.get('/plans/stats', auth_middleware_1.authenticate, plan_controller_1.getDashboardStats);
router.get('/plans/recent-completions', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['PT']), plan_controller_1.getRecentCompletions);
router.get('/plans/client-history/:clientId', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['PT']), plan_controller_1.getClientHistory);
router.post('/plans/check-expired', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['CLIENT']), plan_controller_1.checkExpiredPlans);
// USERS
router.get('/users/search', auth_middleware_1.authenticate, User_controller_1.searchUser);
router.get('/users', auth_middleware_1.authenticate, User_controller_1.getAllUsers);
router.get('/users/my-clients', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['PT']), User_controller_1.getMyClients);
router.put('/users/profile', auth_middleware_1.authenticate, User_controller_1.updateProfile);
router.get('/users/available-pts', auth_middleware_1.authenticate, User_controller_1.getAvailablePTs);
router.post('/users/request-pt', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['CLIENT']), User_controller_1.requestPT);
router.post('/users/add-client', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['PT']), User_controller_1.addClientByPT);
router.post('/users/assign-client', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['PT']), User_controller_1.assignExistingClient);
// MESSAGES
router.post('/messages/conversations', auth_middleware_1.authenticate, message_controller_1.createConversation);
router.get('/messages/conversations', auth_middleware_1.authenticate, message_controller_1.getConversations);
router.post('/messages', auth_middleware_1.authenticate, message_controller_1.sendMessage);
router.get('/messages/conversation/:conversationId', auth_middleware_1.authenticate, message_controller_1.getMessages);
router.put('/messages/conversation/:conversationId/read', auth_middleware_1.authenticate, message_controller_1.markAsRead);
// ADMIN
router.get('/admin/dashboard', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['ADMIN']), admin_controller_1.getAdminDashboard);
router.get('/admin/recent-activity', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['ADMIN']), admin_controller_1.getRecentActivity);
router.get('/admin/pending-pts', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['ADMIN']), User_controller_1.getPendingPTs);
router.patch('/admin/users/:userId/validate', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['ADMIN']), User_controller_1.validateUser);
router.patch('/admin/users/change-pt', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['ADMIN']), User_controller_1.adminChangePt);
router.delete('/admin/users/:userId', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['ADMIN']), User_controller_1.deleteUser);
router.get('/admin/users', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['ADMIN']), User_controller_1.getAllUsers);
exports.default = router;
