import { Router } from 'express';
import { login, register, qrLogin } from '../controllers/auth.controller';
import { createPlan, getPlans, completeWorkout } from '../controllers/plan.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/qr-login', qrLogin);

router.post('/plans', authenticate, authorize(['PT']), createPlan);
router.get('/plans', authenticate, getPlans);
router.post('/plans/:id/complete', authenticate, completeWorkout);

router.get('/admin/users', authenticate, authorize(['ADMIN']), (req, res) => {
    res.json({ message: "Admin access granted" });
});

export default router;