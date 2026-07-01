import DeliveryPartner from '../models/DeliveryPartner.js';

export async function loadDeliveryProfile(req, res, next) {
  try {
    const partner = await DeliveryPartner.findOne({ user: req.user._id });
    if (!partner) {
      return res.status(404).json({ message: 'Delivery partner profile not found' });
    }
    req.deliveryPartner = partner;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export { roleRequired } from './partner.js';
