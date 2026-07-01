import mongoose from 'mongoose';

const priceItemSchema = new mongoose.Schema(
  {
    itemId: { type: String, required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const cleanerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, sparse: true },
    shopName: { type: String, required: true, trim: true },
    ownerName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    address: {
      line1: String,
      city: { type: String, default: 'Delhi' },
      pincode: String,
      lat: Number,
      lng: Number,
    },
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0, min: 0 },
    deliveryHours: { type: Number, default: 48, min: 1 },
    deliveryFee: { type: Number, default: 50, min: 0 },
    commissionRate: { type: Number, default: 0.15, min: 0, max: 1 },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'suspended'],
      default: 'pending',
    },
    bankDetails: {
      accountName: String,
      accountNumber: String,
      ifsc: String,
    },
    services: [{ type: String }],
    prices: [priceItemSchema],
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Cleaner', cleanerSchema);
