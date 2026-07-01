import { Router } from 'express';
import { register, login, getMe } from '../controllers/auth.controller.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authRequired, getMe);

export default router;
