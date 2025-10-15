import express from 'express';
const router = express.Router();
import * as ctrl from '../controllers/clients.controller';
import { auth } from '../middlewares/auth.middleware';
import { isAnalistaOrAdmin } from '../middlewares/role.middleware';
import { validateCedulaUnique } from '../middlewares/validations.middleware';

router.use(auth, isAnalistaOrAdmin);
router.get('/', ctrl.listClients);
router.post('/search', ctrl.searchClient);
router.post('/', validateCedulaUnique, ctrl.createClient); // Admin only, add isAdmin if needed

// CRUD admin...
export default router;