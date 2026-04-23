import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  orderItems: [
    {
      name: { type: String, required: true },
      qty: { type: Number, required: true },
      image: { type: String, required: true },
      price: { type: Number, required: true },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product',
      },
    }
  ],
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
  },
  paymentMethod: { type: String, required: true, default: 'UPI' },
  itemsPrice: { type: Number, required: true, default: 0.0 },
  deliveryCharge: { type: Number, required: true, default: 0.0 },
  totalPrice: { type: Number, required: true, default: 0.0 },
  paymentStatus: {
    type: String,
    required: true,
    enum: ['Pending', 'Payment Pending Verification', 'Confirmed', 'Failed'],
    default: 'Pending',
  },
  isUPIVerificationPending: {
    type: Boolean,
    default: false
  },
  hasUserMarkedPaid: {
    type: Boolean,
    default: false
  },
  orderStatus: {
    type: String,
    required: true,
    enum: ['Pending', 'Confirmed', 'Processing', 'Out for Delivery', 'Delivered', 'Cancelled'],
    default: 'Pending'
  }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;
