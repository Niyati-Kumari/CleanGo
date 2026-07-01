import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Cleaner from '../models/Cleaner.js';

function signToken(user) {
  return jwt.sign(
    { userId: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export async function register(req, res) {
  try {
    const { name, phone, email, password } = req.body;

    if (!name?.trim() || !phone?.trim() || !password || password.length < 6) {
      return res.status(400).json({ message: 'Name, phone, and password (6+ chars) are required' });
    }

    const existing = await User.findOne({ phone: phone.trim() });
    if (existing) {
      return res.status(409).json({ message: 'Phone number already registered' });
    }

    const user = await User.create({
      name: name.trim(),
      phone: phone.trim(),
      email: email?.trim(),
      password,
      role: 'customer',
    });

    const token = signToken(user);
    res.status(201).json({ token, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function login(req, res) {
  try {
    const { phone, password } = req.body;

    if (!phone?.trim() || !password) {
      return res.status(400).json({ message: 'Phone and password are required' });
    }

    const user = await User.findOne({ phone: phone.trim() });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid phone or password' });
    }

    const token = signToken(user);
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function getMe(req, res) {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    let cleaner = null;
    if (user.role === 'cleaner') {
      cleaner = await Cleaner.findOne({ user: user._id });
    }

    res.json({ user, cleaner });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
