import User from '../models/User.js';
import Cleaner from '../models/Cleaner.js';
import DeliveryPartner from '../models/DeliveryPartner.js';
import Order from '../models/Order.js';

export async function getDashboard(req, res) {
  try {
    const userCount = await User.countDocuments();
    const cleanerCount = await Cleaner.countDocuments({ status: 'approved' });
    const deliveryCount = await DeliveryPartner.countDocuments({ status: 'approved' });
    const orderCount = await Order.countDocuments();
    
    const totalRevenue = await Order.aggregate([
      { $match: { status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]);
    
    const pendingCleaners = await Cleaner.countDocuments({ status: 'pending' });
    const pendingDelivery = await DeliveryPartner.countDocuments({ status: 'pending' });

    res.json({
      users: userCount,
      cleaners: cleanerCount,
      deliveryPartners: deliveryCount,
      orders: orderCount,
      revenue: totalRevenue[0]?.total || 0,
      pendingCleaners,
      pendingDelivery,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function listUsers(req, res) {
  try {
    const { role, page = 1, limit = 20 } = req.query;
    const filter = role ? { role } : {};
    
    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    const total = await User.countDocuments(filter);
    
    res.json({ users, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function listCleaners(req, res) {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = status ? { status } : {};
    
    const cleaners = await Cleaner.find(filter)
      .populate('user', 'name phone email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    const total = await Cleaner.countDocuments(filter);
    
    res.json({ cleaners, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function approveCleaner(req, res) {
  try {
    const cleaner = await Cleaner.findById(req.params.id);
    
    if (!cleaner) {
      return res.status(404).json({ message: 'Cleaner not found' });
    }

    cleaner.status = 'approved';
    await cleaner.save();
    
    res.json({ message: 'Cleaner approved', cleaner });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function rejectCleaner(req, res) {
  try {
    const cleaner = await Cleaner.findById(req.params.id);
    
    if (!cleaner) {
      return res.status(404).json({ message: 'Cleaner not found' });
    }

    cleaner.status = 'rejected';
    await cleaner.save();
    
    res.json({ message: 'Cleaner rejected', cleaner });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function listDeliveryPartners(req, res) {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = status ? { status } : {};
    
    const partners = await DeliveryPartner.find(filter)
      .populate('user', 'name phone email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    const total = await DeliveryPartner.countDocuments(filter);
    
    res.json({ partners, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function approveDeliveryPartner(req, res) {
  try {
    const partner = await DeliveryPartner.findById(req.params.id);
    
    if (!partner) {
      return res.status(404).json({ message: 'Delivery partner not found' });
    }

    partner.status = 'approved';
    await partner.save();
    
    res.json({ message: 'Delivery partner approved', partner });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function rejectDeliveryPartner(req, res) {
  try {
    const partner = await DeliveryPartner.findById(req.params.id);
    
    if (!partner) {
      return res.status(404).json({ message: 'Delivery partner not found' });
    }

    partner.status = 'rejected';
    await partner.save();
    
    res.json({ message: 'Delivery partner rejected', partner });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function listOrders(req, res) {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = status ? { status } : {};
    
    const orders = await Order.find(filter)
      .populate('customer', 'name phone')
      .populate('cleaner', 'shopName')
      .populate('assignedDeliveryPartner', 'name phone')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    const total = await Order.countDocuments(filter);
    
    res.json({ orders, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getRevenueStats(req, res) {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    
    const dailyRevenue = await Order.aggregate([
      { $match: { status: 'delivered', createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          total: { $sum: '$total' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    
    res.json(dailyRevenue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
