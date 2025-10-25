import { Router } from 'express';
import { StudentController } from '../controllers/StudentController';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const studentController = new StudentController();

// Rotas públicas (sem autenticação) - para demonstração
router.get('/', studentController.findAll.bind(studentController));
router.get('/:id', studentController.findById.bind(studentController));
router.get('/cpf/:cpf', studentController.findByCpf.bind(studentController));
router.get('/institution/:institutionId', studentController.findByInstitution.bind(studentController));
router.post('/', studentController.create.bind(studentController));
router.put('/:id', studentController.update.bind(studentController));
router.delete('/:id', studentController.delete.bind(studentController));

export default router;
