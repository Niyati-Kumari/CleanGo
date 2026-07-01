import { Router } from 'express';
import {
  createOrder,
  listMyOrders,
  getOrder,
  getOrderStatuses,
  simulateProgress,
} from '../controllers/orders.controller.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

router.get('/statuses', getOrderStatuses);
router.post('/', authRequired, createOrder);
router.get('/', authRequired, listMyOrders);
router.get('/:id', authRequired, getOrder);
router.post('/:id/progress', authRequired, simulateProgress);

export default router;
