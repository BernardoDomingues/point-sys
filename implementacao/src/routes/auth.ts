import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const authController = new AuthController();

router.post('/login', authController.login.bind(authController));
router.post('/register/student', authController.registerStudent.bind(authController));
router.get('/profile', authenticateToken, authController.getProfile.bind(authController));

export default router;
