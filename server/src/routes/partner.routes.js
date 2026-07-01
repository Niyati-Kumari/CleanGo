import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import { loadCleanerProfile, roleRequired } from '../middleware/partner.js';
import {
  registerPartner,
  getProfile,
  updateProfile,
  updatePrices,
  getDashboard,
  listPartnerOrders,
  getPartnerOrder,
  acceptOrder,
  rejectOrder,
  updateOrderStatus,
  getEarnings,
} from '../controllers/partner.controller.js';

const router = Router();

router.post('/register', registerPartner);

router.use(authRequired, roleRequired('cleaner'), loadCleanerProfile);

router.get('/me', getProfile);
router.patch('/profile', updateProfile);
router.patch('/prices', updatePrices);
router.get('/dashboard', getDashboard);
router.get('/earnings', getEarnings);
router.get('/orders', listPartnerOrders);
router.get('/orders/:id', getPartnerOrder);
router.post('/orders/:id/accept', acceptOrder);
router.post('/orders/:id/reject', rejectOrder);
router.patch('/orders/:id/status', updateOrderStatus);

export default router;
