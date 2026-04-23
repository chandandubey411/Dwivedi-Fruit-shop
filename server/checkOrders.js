import mongoose from 'mongoose';
import Order from './models/Order.js';

mongoose.connect('mongodb+srv://d1:d1@cluster0.ouqd0ra.mongodb.net/divedi', {})
.then(async () => {
    const orders = await Order.find().sort({ createdAt: -1 }).limit(10);
    console.log(orders.map(o => ({
        id: o._id,
        user: o.user,
        paymentStatus: o.paymentStatus,
        orderStatus: o.orderStatus,
        paymentMethod: o.paymentMethod,
        total: o.totalPrice
    })));
    process.exit();
});
