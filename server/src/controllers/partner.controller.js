import User from "../models/User.js";
import Cleaner from "../models/Cleaner.js";
import Order from "../models/Order.js";
import jwt from "jsonwebtoken";
import {
  SERVICE_CATALOG,
  ORDER_STATUSES,
  findCatalogItem,
} from "../data/catalog.js";

function signToken(user) {
  return jwt.sign(
    { userId: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );
}

function buildDefaultPrices(services = []) {
  const prices = [];
  for (const category of SERVICE_CATALOG) {
    if (services.length > 0 && !services.includes(category.id)) continue;
    for (const item of category.items) {
      prices.push({
        itemId: item.id,
        name: item.name,
        category: category.id,
        price: item.basePrice,
      });
    }
  }
  return prices;
}

function calcCleanerEarning(order, commissionRate) {
  return Math.round(order.subtotal * (1 - commissionRate));
}

export async function registerPartner(req, res) {
  try {
    const {
      name,
      phone,
      email,
      password,
      shopName,
      ownerName,
      shopPhone,
      address,
      services,
      deliveryHours,
      deliveryFee,
      bankDetails,
    } = req.body;

    if (!name?.trim() || !phone?.trim() || !password || password.length < 6) {
      return res
        .status(400)
        .json({ message: "Name, phone, and password (6+ chars) are required" });
    }
    if (!shopName?.trim() || !ownerName?.trim()) {
      return res
        .status(400)
        .json({ message: "Shop name and owner name are required" });
    }

    const existingUser = await User.findOne({ phone: phone.trim() });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Phone number already registered" });
    }

    const user = await User.create({
      name: name.trim(),
      phone: phone.trim(),
      email: email?.trim(),
      password,
      role: "cleaner",
    });

    const cleaner = await Cleaner.create({
      user: user._id,
      shopName: shopName.trim(),
      ownerName: ownerName.trim(),
      phone: (shopPhone || phone).trim(),
      address: {
        line1: address?.line1 || "",
        city: (address?.city || "Delhi").trim(),
        pincode: address?.pincode || "",
      },
      services: services?.length ? services : ["clothes"],
      prices: buildDefaultPrices(services?.length ? services : ["clothes"]),
      deliveryHours: deliveryHours || 48,
      deliveryFee: deliveryFee ?? 50,
      bankDetails: bankDetails || {},
      status: "pending",
    });

    const token = signToken(user);
    res.status(201).json({ token, user, cleaner });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function getProfile(req, res) {
  try {
    res.json({ cleaner: req.cleaner });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function updateProfile(req, res) {
  try {
    const {
      shopName,
      ownerName,
      phone,
      address,
      deliveryHours,
      deliveryFee,
      services,
      bankDetails,
    } = req.body;

    if (shopName) req.cleaner.shopName = shopName.trim();
    if (ownerName) req.cleaner.ownerName = ownerName.trim();
    if (phone) req.cleaner.phone = phone.trim();
    if (address) {
      req.cleaner.address = {
        ...req.cleaner.address,
        ...address,
        ...(address.city ? { city: address.city.trim() } : {}),
      };
    }
    if (deliveryHours) req.cleaner.deliveryHours = deliveryHours;
    if (deliveryFee != null) req.cleaner.deliveryFee = deliveryFee;
    if (services?.length) req.cleaner.services = services;
    if (bankDetails)
      req.cleaner.bankDetails = { ...req.cleaner.bankDetails, ...bankDetails };

    await req.cleaner.save();
    res.json({ cleaner: req.cleaner });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function updatePrices(req, res) {
  try {
    const { prices } = req.body;
    if (!Array.isArray(prices)) {
      return res.status(400).json({ message: "Prices array is required" });
    }

    for (const { itemId, price } of prices) {
      const catalogItem = findCatalogItem(itemId);
      if (!catalogItem) continue;

      const idx = req.cleaner.prices.findIndex((p) => p.itemId === itemId);
      const entry = {
        itemId,
        name: catalogItem.name,
        category: catalogItem.category,
        price: Math.max(0, Number(price)),
      };

      if (idx >= 0) req.cleaner.prices[idx] = entry;
      else req.cleaner.prices.push(entry);
    }

    await req.cleaner.save();
    res.json({ cleaner: req.cleaner });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function getDashboard(req, res) {
  try {
    const cleanerId = req.cleaner._id;
    const [pending, active, completed, earningsAgg] = await Promise.all([
      Order.countDocuments({ cleaner: cleanerId, cleanerDecision: "pending" }),
      Order.countDocuments({
        cleaner: cleanerId,
        cleanerDecision: "accepted",
        status: { $nin: ["delivered", "cancelled"] },
      }),
      Order.countDocuments({ cleaner: cleanerId, status: "delivered" }),
      Order.find({
        cleaner: cleanerId,
        status: "delivered",
        cleanerDecision: "accepted",
      }).lean(),
    ]);

    const totalEarnings = earningsAgg.reduce(
      (sum, o) => sum + calcCleanerEarning(o, req.cleaner.commissionRate),
      0,
    );

    res.json({
      stats: {
        pendingOrders: pending,
        activeOrders: active,
        completedOrders: completed,
        totalEarnings,
        approvalStatus: req.cleaner.status,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function listPartnerOrders(req, res) {
  try {
    const { filter = "all" } = req.query;
    const query = { cleaner: req.cleaner._id };

    if (filter === "new") query.cleanerDecision = "pending";
    else if (filter === "active") {
      query.cleanerDecision = "accepted";
      query.status = { $nin: ["delivered", "cancelled"] };
    } else if (filter === "completed") query.status = "delivered";
    else if (filter === "rejected") query.cleanerDecision = "rejected";

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .populate("customer", "name phone")
      .lean();

    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function getPartnerOrder(req, res) {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      cleaner: req.cleaner._id,
    }).populate("customer", "name phone addresses");

    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function acceptOrder(req, res) {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      cleaner: req.cleaner._id,
    });

    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.cleanerDecision !== "pending") {
      return res.status(400).json({ message: "Order already processed" });
    }
    if (req.cleaner.status !== "approved") {
      return res
        .status(403)
        .json({ message: "Shop must be approved before accepting orders" });
    }

    order.cleanerDecision = "accepted";
    order.statusHistory.push({
      status: order.status,
      note: "Accepted by cleaner",
    });
    await order.save();
    await order.populate("customer", "name phone");

    res.json({ order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function rejectOrder(req, res) {
  try {
    const { reason } = req.body;
    const order = await Order.findOne({
      _id: req.params.id,
      cleaner: req.cleaner._id,
    });

    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.cleanerDecision !== "pending") {
      return res.status(400).json({ message: "Order already processed" });
    }

    order.cleanerDecision = "rejected";
    order.status = "cancelled";
    order.statusHistory.push({
      status: "cancelled",
      note: reason || "Rejected by cleaner",
    });
    await order.save();
    await order.populate("customer", "name phone");

    res.json({ order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function updateOrderStatus(req, res) {
  try {
    const { status, note } = req.body;
    const order = await Order.findOne({
      _id: req.params.id,
      cleaner: req.cleaner._id,
    });

    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.cleanerDecision !== "accepted") {
      return res.status(400).json({ message: "Order must be accepted first" });
    }
    if (order.status === "cancelled" || order.status === "delivered") {
      return res.status(400).json({ message: "Order is closed" });
    }

    const validKeys = ORDER_STATUSES.map((s) => s.key);
    if (!validKeys.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const currentIdx = validKeys.indexOf(order.status);
    const newIdx = validKeys.indexOf(status);
    if (newIdx <= currentIdx) {
      return res.status(400).json({ message: "Status can only move forward" });
    }

    order.status = status;
    order.statusHistory.push({ status, note: note || "Updated by cleaner" });
    if (status === "delivered") order.paymentStatus = "paid";
    await order.save();
    await order.populate("customer", "name phone");

    res.json({ order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function getEarnings(req, res) {
  try {
    const orders = await Order.find({
      cleaner: req.cleaner._id,
      status: "delivered",
      cleanerDecision: "accepted",
    })
      .sort({ updatedAt: -1 })
      .select("orderNumber subtotal total deliveryFee createdAt updatedAt")
      .lean();

    const rate = req.cleaner.commissionRate;
    const summary = orders.map((o) => ({
      orderNumber: o.orderNumber,
      subtotal: o.subtotal,
      commission: Math.round(o.subtotal * rate),
      earning: calcCleanerEarning(o, rate),
      deliveredAt: o.updatedAt,
    }));

    const totalEarnings = summary.reduce((sum, s) => sum + s.earning, 0);
    const totalCommission = summary.reduce((sum, s) => sum + s.commission, 0);

    res.json({
      commissionRate: rate,
      totalEarnings,
      totalCommission,
      orderCount: summary.length,
      orders: summary,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
