import { Router } from 'express';
import { CompanyController } from '../controllers/CompanyController';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const companyController = new CompanyController();

// Rotas públicas (sem autenticação)
router.post('/', companyController.create.bind(companyController));

// Rotas protegidas (requer autenticação)
router.get('/', authenticateToken, companyController.findAll.bind(companyController));
router.get('/active', authenticateToken, companyController.findActive.bind(companyController));
router.get('/search', authenticateToken, companyController.searchByName.bind(companyController));
router.get('/:id', authenticateToken, companyController.findById.bind(companyController));
router.get('/cnpj/:cnpj', authenticateToken, companyController.findByCnpj.bind(companyController));
router.put('/:id', authenticateToken, companyController.update.bind(companyController));
router.patch('/:id/toggle', authenticateToken, companyController.toggleActive.bind(companyController));
router.delete('/:id', authenticateToken, companyController.delete.bind(companyController));

export default router;
