import { Router } from 'express';
import { CompanyController } from '../controllers/CompanyController';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const companyController = new CompanyController();

// Rotas públicas (sem autenticação) - para demonstração
router.get('/', companyController.findAll.bind(companyController));
router.get('/active', companyController.findActive.bind(companyController));
router.get('/search', companyController.searchByName.bind(companyController));
router.get('/:id', companyController.findById.bind(companyController));
router.get('/cnpj/:cnpj', companyController.findByCnpj.bind(companyController));
router.post('/', companyController.create.bind(companyController));
router.put('/:id', companyController.update.bind(companyController));
router.put('/:id/toggle', companyController.toggleActive.bind(companyController));
router.delete('/:id', companyController.delete.bind(companyController));

export default router;
