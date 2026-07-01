import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import { roleRequired } from '../middleware/partner.js';
import {
  getDashboard,
  listUsers,
  listCleaners,
  approveCleaner,
  rejectCleaner,
  listDeliveryPartners,
  approveDeliveryPartner,
  rejectDeliveryPartner,
  listOrders,
  getRevenueStats,
} from '../controllers/admin.controller.js';

const router = Router();

router.use(authRequired, roleRequired('admin'));

router.get('/dashboard', getDashboard);
router.get('/users', listUsers);
router.get('/cleaners', listCleaners);
router.post('/cleaners/:id/approve', approveCleaner);
router.post('/cleaners/:id/reject', rejectCleaner);
router.get('/delivery-partners', listDeliveryPartners);
router.post('/delivery-partners/:id/approve', approveDeliveryPartner);
router.post('/delivery-partners/:id/reject', rejectDeliveryPartner);
router.get('/orders', listOrders);
router.get('/revenue', getRevenueStats);

export default router;
