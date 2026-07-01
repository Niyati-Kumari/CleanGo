import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    itemId: { type: String, required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    lineTotal: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const statusHistorySchema = new mongoose.Schema(
  {
    status: { type: String, required: true },
    note: String,
    at: { type: Date, default: Date.now },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, unique: true, required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    cleaner: { type: mongoose.Schema.Types.ObjectId, ref: 'Cleaner', required: true },
    items: [orderItemSchema],
    subtotal: { type: Number, required: true, min: 0 },
    deliveryFee: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
    pickupSlot: {
      date: { type: String, required: true },
      timeWindow: { type: String, required: true },
    },
    deliveryAddress: {
      line1: String,
      city: String,
      pincode: String,
    },
    paymentMethod: { type: String, enum: ['online', 'cod'], default: 'cod' },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    cleanerDecision: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
    assignedDeliveryPartner: { type: mongoose.Schema.Types.ObjectId, ref: 'DeliveryPartner' },
    status: {
      type: String,
      enum: [
        'pickup_scheduled',
        'picked_up',
        'cleaning_started',
        'quality_check',
        'out_for_delivery',
        'delivered',
        'cancelled',
      ],
      default: 'pickup_scheduled',
    },
    statusHistory: [statusHistorySchema],
    deliveryOtp: { type: String, default: () => String(Math.floor(1000 + Math.random() * 9000)) },
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
