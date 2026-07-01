import Cleaner from '../models/Cleaner.js';

export function roleRequired(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.userRole)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
}

export async function loadCleanerProfile(req, res, next) {
  try {
    const cleaner = await Cleaner.findOne({ user: req.userId });
    if (!cleaner) {
      return res.status(404).json({ message: 'Cleaner profile not found' });
    }
    req.cleaner = cleaner;
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
