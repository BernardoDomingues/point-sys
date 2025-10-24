import { Router } from 'express';
import { StudentController } from '../controllers/StudentController';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const studentController = new StudentController();

// Rotas públicas (sem autenticação)
router.post('/', studentController.create.bind(studentController));

// Rotas protegidas (requer autenticação)
router.get('/', authenticateToken, studentController.findAll.bind(studentController));
router.get('/:id', authenticateToken, studentController.findById.bind(studentController));
router.get('/cpf/:cpf', authenticateToken, studentController.findByCpf.bind(studentController));
router.get('/institution/:institutionId', authenticateToken, studentController.findByInstitution.bind(studentController));
router.put('/:id', authenticateToken, studentController.update.bind(studentController));
router.delete('/:id', authenticateToken, studentController.delete.bind(studentController));

export default router;
