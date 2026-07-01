import Order from '../models/Order.js';
import Cleaner from '../models/Cleaner.js';
import { findCatalogItem, generateOrderNumber, ORDER_STATUSES } from '../data/catalog.js';

export function getOrderStatuses(_req, res) {
  res.json({ statuses: ORDER_STATUSES });
}

export async function createOrder(req, res) {
  try {
    const {
      cleanerId,
      items,
      pickupSlot,
      deliveryAddress,
      paymentMethod = 'cod',
    } = req.body;

    if (!cleanerId || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Cleaner and items are required' });
    }

    if (!pickupSlot?.date || !pickupSlot?.timeWindow) {
      return res.status(400).json({ message: 'Pickup slot is required' });
    }

    const cleaner = await Cleaner.findById(cleanerId);
    if (!cleaner || cleaner.status !== 'approved') {
      return res.status(404).json({ message: 'Cleaner not found' });
    }

    const orderItems = [];
    let subtotal = 0;

    for (const { itemId, quantity } of items) {
      const qty = Number(quantity);
      if (!itemId || !qty || qty < 1) continue;

      const catalogItem = findCatalogItem(itemId);
      if (!catalogItem) {
        return res.status(400).json({ message: `Unknown item: ${itemId}` });
      }

      const priceEntry = cleaner.prices.find((p) => p.itemId === itemId);
      const unitPrice = priceEntry?.price ?? catalogItem.basePrice;
      const lineTotal = unitPrice * qty;
      subtotal += lineTotal;

      orderItems.push({
        itemId,
        name: catalogItem.name,
        category: catalogItem.category,
        quantity: qty,
        unitPrice,
        lineTotal,
      });
    }

    if (orderItems.length === 0) {
      return res.status(400).json({ message: 'At least one valid item is required' });
    }

    const deliveryFee = cleaner.deliveryFee;
    const total = subtotal + deliveryFee;

    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      customer: req.userId,
      cleaner: cleanerId,
      items: orderItems,
      subtotal,
      deliveryFee,
      total,
      pickupSlot,
      deliveryAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      cleanerDecision: 'pending',
      status: 'pickup_scheduled',
      statusHistory: [{ status: 'pickup_scheduled', note: 'Order placed — awaiting cleaner' }],
    });

    await order.populate('cleaner', 'shopName rating deliveryHours address');
    res.status(201).json({ order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function listMyOrders(req, res) {
  try {
    const orders = await Order.find({ customer: req.userId })
      .sort({ createdAt: -1 })
      .populate('cleaner', 'shopName rating deliveryHours')
      .lean();
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function getOrder(req, res) {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      customer: req.userId,
    }).populate('cleaner', 'shopName rating deliveryHours phone address');

    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function simulateProgress(req, res) {
  try {
    const order = await Order.findOne({ _id: req.params.id, customer: req.userId });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.cleanerDecision === 'pending') {
      return res.status(400).json({ message: 'Waiting for cleaner to accept the order' });
    }
    if (order.cleanerDecision === 'rejected') {
      return res.status(400).json({ message: 'Order was rejected by the cleaner' });
    }

    const flow = ORDER_STATUSES.map((s) => s.key);
    const idx = flow.indexOf(order.status);
    if (idx === -1 || idx === flow.length - 1) {
      return res.json({ order, message: 'Order already at final status' });
    }

    order.status = flow[idx + 1];
    order.statusHistory.push({ status: order.status, note: 'Status updated (demo)' });
    if (order.status === 'delivered') order.paymentStatus = 'paid';
    await order.save();
    await order.populate('cleaner', 'shopName rating deliveryHours');

    res.json({ order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
