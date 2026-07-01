import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import { loadDeliveryProfile, roleRequired } from '../middleware/delivery.js';
import {
  registerDeliveryPartner,
  getProfile,
  updateProfile,
  toggleOnlineStatus,
  updateLocation,
  getAvailableDeliveries,
  acceptDelivery,
  updateDeliveryStatus,
  getEarnings,
} from '../controllers/delivery.controller.js';

const router = Router();

router.post('/register', registerDeliveryPartner);

router.use(authRequired, roleRequired('delivery'), loadDeliveryProfile);

router.get('/me', getProfile);
router.patch('/profile', updateProfile);
router.post('/toggle-online', toggleOnlineStatus);
router.patch('/location', updateLocation);
router.get('/deliveries', getAvailableDeliveries);
router.post('/deliveries/:id/accept', acceptDelivery);
router.patch('/deliveries/:id/status', updateDeliveryStatus);
router.get('/earnings', getEarnings);

export default router;
