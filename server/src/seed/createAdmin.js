// Idempotently ensures a demo admin account exists, without touching any
// other data (unlike seed.js, which wipes cleaners/delivery partners).
//
// Usage: npm run seed:admin
import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';

const ADMIN_PHONE = '0000000000';
const ADMIN_PASSWORD = 'admin123';

async function createAdmin() {
  await connectDB();

  const existing = await User.findOne({ phone: ADMIN_PHONE });
  if (existing) {
    if (existing.role !== 'admin') {
      existing.role = 'admin';
      await existing.save();
      console.log(`Updated existing user ${ADMIN_PHONE} to role "admin".`);
    } else {
      console.log(`Admin account already exists — phone: ${ADMIN_PHONE}`);
    }
  } else {
    await User.create({
      name: 'Admin User',
      phone: ADMIN_PHONE,
      password: ADMIN_PASSWORD,
      role: 'admin',
    });
    console.log(`Created admin account — phone: ${ADMIN_PHONE}, password: ${ADMIN_PASSWORD}`);
  }

  await mongoose.disconnect();
}

createAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
