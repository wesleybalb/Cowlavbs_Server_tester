import { Router } from 'express';
import RegistroController from '../controllers/RegistroController.js';

const router = Router();
router.post('/auth/register', RegistroController.registro);
router.get('/users', RegistroController.getAllReg)

export default router;
