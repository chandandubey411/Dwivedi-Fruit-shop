import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  deliveryCharge: { type: Number, required: true, default: 40 },
  upiId: { type: String, required: true, default: 'diwedifruits@upi' },
  qrImageUrl: { type: String, required: true, default: '/images/sample-qr.jpg' }
}, { timestamps: true });

const Settings = mongoose.model('Settings', settingsSchema);
export default Settings;
