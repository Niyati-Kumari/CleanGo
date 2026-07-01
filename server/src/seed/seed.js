import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import Cleaner from '../models/Cleaner.js';
import DeliveryPartner from '../models/DeliveryPartner.js';
import User from '../models/User.js';
import { SERVICE_CATALOG } from '../data/catalog.js';

function buildPrices(multiplier) {
  const prices = [];
  for (const category of SERVICE_CATALOG) {
    for (const item of category.items) {
      prices.push({
        itemId: item.id,
        name: item.name,
        category: category.id,
        price: Math.round(item.basePrice * multiplier),
      });
    }
  }
  return prices;
}

const CLEANERS = [
  {
    shopName: 'Royal Cleaners',
    ownerName: 'Rajesh Kumar',
    phone: '9876500001',
    address: { line1: '12 Connaught Place', city: 'Delhi', pincode: '110001' },
    rating: 4.8,
    reviewCount: 342,
    deliveryHours: 24,
    deliveryFee: 50,
    isFeatured: true,
    status: 'approved',
    services: ['clothes', 'shoes', 'bags'],
    prices: buildPrices(1.0),
  },
  {
    shopName: 'Fresh Laundry',
    ownerName: 'Priya Sharma',
    phone: '9876500002',
    address: { line1: '45 Saket Market', city: 'Delhi', pincode: '110017' },
    rating: 4.5,
    reviewCount: 218,
    deliveryHours: 48,
    deliveryFee: 40,
    status: 'approved',
    services: ['clothes', 'curtains'],
    prices: buildPrices(0.88),
  },
  {
    shopName: 'Sparkle Dry Clean',
    ownerName: 'Amit Singh',
    phone: '9876500003',
    address: { line1: '78 Lajpat Nagar', city: 'Delhi', pincode: '110024' },
    rating: 4.6,
    reviewCount: 156,
    deliveryHours: 36,
    deliveryFee: 45,
    status: 'approved',
    services: ['clothes', 'shoes', 'sofa'],
    prices: buildPrices(0.95),
  },
  {
    shopName: 'Urban Wash Hub',
    ownerName: 'Neha Gupta',
    phone: '9876500004',
    address: { line1: '22 Dwarka Sector 10', city: 'Delhi', pincode: '110075' },
    rating: 4.3,
    reviewCount: 89,
    deliveryHours: 48,
    deliveryFee: 35,
    status: 'approved',
    services: ['clothes', 'bags', 'curtains'],
    prices: buildPrices(0.82),
  },
];

const DELIVERY_PARTNERS = [
  {
    name: 'Vikram Singh',
    phone: '7777777777',
    vehicleType: 'bike',
    vehicleNumber: 'DL01AB1234',
    area: 'South Delhi',
    address: { line1: 'A-45, Greater Kailash', city: 'Delhi', pincode: '110048' },
    status: 'approved',
    isOnline: true,
    rating: 4.7,
    deliveryCount: 156,
    totalEarnings: 6240,
  },
  {
    name: 'Suresh Kumar',
    phone: '7777777778',
    vehicleType: 'scooter',
    vehicleNumber: 'DL02CD5678',
    area: 'Central Delhi',
    address: { line1: 'B-12, Connaught Place', city: 'Delhi', pincode: '110001' },
    status: 'approved',
    isOnline: false,
    rating: 4.5,
    deliveryCount: 89,
    totalEarnings: 3560,
  },
  {
    name: 'Rahul Verma',
    phone: '7777777779',
    vehicleType: 'bike',
    vehicleNumber: 'DL03EF9012',
    area: 'West Delhi',
    address: { line1: 'C-78, Rajouri Garden', city: 'Delhi', pincode: '110027' },
    status: 'pending',
    isOnline: false,
    rating: 4.0,
    deliveryCount: 0,
    totalEarnings: 0,
  },
];

async function seed() {
  await connectDB();

  await Cleaner.deleteMany({});
  await DeliveryPartner.deleteMany({});
  await User.deleteMany({ phone: { $in: ['9999999999', '8888888888', '7777777777', '7777777778', '7777777779', '0000000000'] } });

  const partnerUser = await User.create({
    name: 'Rajesh Kumar',
    phone: '8888888888',
    password: 'demo123',
    role: 'cleaner',
  });

  const cleaners = await Cleaner.insertMany(CLEANERS);
  const royal = cleaners.find((c) => c.shopName === 'Royal Cleaners');
  royal.user = partnerUser._id;
  await royal.save();

  await User.create({
    name: 'Demo Customer',
    phone: '9999999999',
    password: 'demo123',
    role: 'customer',
    addresses: [
      {
        label: 'Home',
        line1: 'B-42, Green Park',
        city: 'Delhi',
        pincode: '110016',
      },
    ],
  });

  const adminUser = await User.create({
    name: 'Admin User',
    phone: '0000000000',
    password: 'admin123',
    role: 'admin',
  });

  const deliveryUsers = await User.insertMany(
    DELIVERY_PARTNERS.map((dp) => ({
      name: dp.name,
      phone: dp.phone,
      password: 'demo123',
      role: 'delivery',
    }))
  );

  const deliveryPartners = await DeliveryPartner.insertMany(
    DELIVERY_PARTNERS.map((dp, i) => ({
      ...dp,
      user: deliveryUsers[i]._id,
      documents: {
        aadharNumber: '1234-5678-9012',
        drivingLicense: 'DL-123456789012',
        vehicleRC: 'DL01AB1234',
      },
    }))
  );

  console.log('Seeded cleaners, delivery partners, and demo accounts:');
  console.log('  Customer — phone: 9999999999, password: demo123');
  console.log('  Partner  — phone: 8888888888, password: demo123 (Royal Cleaners)');
  console.log('  Delivery — phone: 7777777777, password: demo123 (Vikram Singh)');
  console.log('  Admin    — phone: 0000000000, password: admin123');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
