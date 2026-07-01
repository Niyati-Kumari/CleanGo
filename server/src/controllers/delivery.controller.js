import DeliveryPartner from '../models/DeliveryPartner.js';
import Order from '../models/Order.js';
import User from '../models/User.js';

export async function registerDeliveryPartner(req, res) {
  try {
    const { name, phone, password, vehicleType, vehicleNumber, area, address, documents } = req.body;

    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: 'Phone number already registered' });
    }

    const user = await User.create({
      name,
      phone,
      password,
      role: 'delivery',
    });

    const partner = await DeliveryPartner.create({
      user: user._id,
      name,
      phone,
      vehicleType,
      vehicleNumber,
      area,
      address,
      documents,
      status: 'pending',
    });

    res.status(201).json({
      message: 'Registration submitted. Awaiting admin approval.',
      partner: partner.toJSON(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getProfile(req, res) {
  try {
    const partner = await DeliveryPartner.findOne({ user: req.user._id })
      .populate('user', 'name phone email');
    
    if (!partner) {
      return res.status(404).json({ message: 'Delivery partner profile not found' });
    }

    res.json(partner.toJSON());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function updateProfile(req, res) {
  try {
    const partner = await DeliveryPartner.findOne({ user: req.user._id });
    
    if (!partner) {
      return res.status(404).json({ message: 'Delivery partner profile not found' });
    }

    const { address, vehicleNumber } = req.body;
    
    if (address) partner.address = { ...partner.address, ...address };
    if (vehicleNumber) partner.vehicleNumber = vehicleNumber;
    
    await partner.save();
    
    res.json(partner.toJSON());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function toggleOnlineStatus(req, res) {
  try {
    const partner = await DeliveryPartner.findOne({ user: req.user._id });
    
    if (!partner) {
      return res.status(404).json({ message: 'Delivery partner profile not found' });
    }

    if (partner.status !== 'approved' && partner.status !== 'active') {
      return res.status(403).json({ message: 'Account not approved' });
    }

    partner.isOnline = !partner.isOnline;
    await partner.save();
    
    res.json({ isOnline: partner.isOnline });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function updateLocation(req, res) {
  try {
    const partner = await DeliveryPartner.findOne({ user: req.user._id });
    
    if (!partner) {
      return res.status(404).json({ message: 'Delivery partner profile not found' });
    }

    const { lat, lng } = req.body;
    
    partner.currentLocation = {
      lat,
      lng,
      updatedAt: new Date(),
    };
    
    await partner.save();
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getAvailableDeliveries(req, res) {
  try {
    const partner = await DeliveryPartner.findOne({ user: req.user._id });
    
    if (!partner || !partner.isOnline) {
      return res.status(403).json({ message: 'Partner not online' });
    }

    const orders = await Order.find({
      status: { $in: ['picked_up', 'quality_check', 'out_for_delivery'] },
      cleanerDecision: 'accepted',
    })
      .populate('customer', 'name phone')
      .populate('cleaner', 'shopName address phone')
      .sort({ createdAt: 1 });

    const availableOrders = orders.filter(order => {
      if (order.status === 'picked_up') {
        return true;
      }
      if (order.status === 'quality_check' || order.status === 'out_for_delivery') {
        return !order.assignedDeliveryPartner || order.assignedDeliveryPartner.toString() === partner._id.toString();
      }
      return false;
    });

    res.json(availableOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function acceptDelivery(req, res) {
  try {
    const partner = await DeliveryPartner.findOne({ user: req.user._id });
    
    if (!partner || !partner.isOnline) {
      return res.status(403).json({ message: 'Partner not online' });
    }

    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.assignedDeliveryPartner) {
      return res.status(400).json({ message: 'Order already assigned' });
    }

    order.assignedDeliveryPartner = partner._id;
    
    if (order.status === 'picked_up') {
      order.status = 'cleaning_started';
    } else if (order.status === 'quality_check') {
      order.status = 'out_for_delivery';
    }
    
    await order.save();
    
    res.json({ message: 'Delivery accepted', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function updateDeliveryStatus(req, res) {
  try {
    const partner = await DeliveryPartner.findOne({ user: req.user._id });
    
    if (!partner) {
      return res.status(404).json({ message: 'Delivery partner not found' });
    }

    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.assignedDeliveryPartner?.toString() !== partner._id.toString()) {
      return res.status(403).json({ message: 'Not assigned to this order' });
    }

    const { status, otp } = req.body;

    if (status === 'delivered') {
      if (otp !== order.deliveryOtp) {
        return res.status(400).json({ message: 'Invalid OTP' });
      }
      order.status = 'delivered';
      order.paymentStatus = 'paid';
      
      partner.deliveryCount += 1;
      partner.totalEarnings += order.deliveryFee * partner.commissionRate;
      await partner.save();
    } else {
      order.status = status;
    }

    order.statusHistory.push({
      status: order.status,
      at: new Date(),
    });

    await order.save();
    
    res.json({ message: 'Status updated', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getEarnings(req, res) {
  try {
    const partner = await DeliveryPartner.findOne({ user: req.user._id });
    
    if (!partner) {
      return res.status(404).json({ message: 'Delivery partner not found' });
    }

    const completedOrders = await Order.countDocuments({
      assignedDeliveryPartner: partner._id,
      status: 'delivered',
    });

    res.json({
      totalEarnings: partner.totalEarnings,
      deliveryCount: partner.deliveryCount,
      completedOrders,
      rating: partner.rating,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
