import mongoose from 'mongoose';

const deliveryPartnerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, sparse: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    vehicleType: {
      type: String,
      enum: ['bike', 'scooter', 'cycle'],
      required: true,
    },
    vehicleNumber: { type: String, required: true, trim: true },
    area: { type: String, required: true, trim: true },
    address: {
      line1: String,
      city: { type: String, default: 'Delhi' },
      pincode: String,
      lat: Number,
      lng: Number,
    },
    documents: {
      aadharNumber: String,
      drivingLicense: String,
      vehicleRC: String,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'suspended', 'active', 'offline'],
      default: 'pending',
    },
    isOnline: { type: Boolean, default: false },
    currentLocation: {
      lat: Number,
      lng: Number,
      updatedAt: Date,
    },
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    deliveryCount: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
    commissionRate: { type: Number, default: 0.4, min: 0, max: 1 },
  },
  { timestamps: true }
);

deliveryPartnerSchema.methods.toJSON = function toJSON() {
  const obj = this.toObject();
  if (obj.documents) {
    delete obj.documents.aadharNumber;
    delete obj.documents.drivingLicense;
    delete obj.documents.vehicleRC;
  }
  return obj;
};

export default mongoose.model('DeliveryPartner', deliveryPartnerSchema);
