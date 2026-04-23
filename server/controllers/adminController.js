import Admin from '../models/Admin.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Settings from '../models/Settings.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// Reusable SMTP transporter — .trim() prevents hidden \r\n issues from .env
const createTransporter = () => nodemailer.createTransport({
  host: process.env.SMTP_HOST?.trim(),
  port: Number(process.env.SMTP_PORT?.trim()) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER?.trim(),
    pass: process.env.SMTP_PASS?.trim(),
  },
});

// ============ AUTH ============
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (admin && (await admin.matchPassword(password))) {
      res.json({ _id: admin._id, email: admin.email, token: generateToken(admin._id) });
    } else {
      res.status(401).json({ message: 'Invalid admin credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============ DASHBOARD ============
export const getAnalytics = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    
    // Sum total revenue where payment is confirmed (or all, depending on business logic. Let's do all non-cancelled)
    const validOrders = await Order.find({ orderStatus: { $ne: 'Cancelled' } });
    const totalRevenue = validOrders.reduce((acc, o) => acc + o.totalPrice, 0);

    const pendingOrders = await Order.countDocuments({ orderStatus: 'Pending' });
    const deliveredOrders = await Order.countDocuments({ orderStatus: 'Delivered' });
    const verificationPendingOrders = await Order.countDocuments({ paymentStatus: 'Payment Pending Verification' });

    // Daily Orders Chart Data (Mocking last 7 days aggregation for simplicity, or just recent orders)
    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(30);

    // Simple Map-Reduce on node-side for daily distributions
    const dailyDataRaw = {};
    recentOrders.forEach(o => {
      const date = new Date(o.createdAt).toLocaleDateString();
      if (!dailyDataRaw[date]) dailyDataRaw[date] = { orders: 0, revenue: 0 };
      dailyDataRaw[date].orders += 1;
      dailyDataRaw[date].revenue += o.totalPrice;
    });

    const dailyData = Object.keys(dailyDataRaw).map(date => ({
      date,
      orders: dailyDataRaw[date].orders,
      revenue: dailyDataRaw[date].revenue
    })).reverse();

    res.json({
      cards: { totalOrders, totalRevenue, pendingOrders, deliveredOrders, verificationPendingOrders },
      dailyData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============ ORDERS ============
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'name phone').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.orderStatus = req.body.orderStatus || order.orderStatus;
      
      // Auto-confirm COD payments when order reaches 'Delivered'
      if (order.paymentMethod === 'COD' && order.orderStatus === 'Delivered') {
        order.paymentStatus = 'Confirmed';
      }

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePaymentStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.paymentStatus = req.body.paymentStatus || order.paymentStatus;
      if (req.body.paymentStatus === 'Confirmed' || req.body.paymentStatus === 'Failed') {
         order.isUPIVerificationPending = false;
      }
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============ PRODUCTS ============
export const createProduct = async (req, res) => {
  try {
    const { name, price, images, category, description, countInStock, type, tags, basketItems } = req.body;
    const product = new Product({
      name: name || 'New Draft Product',
      price: price || 0,
      images: Array.isArray(images) ? images : [],
      category: category || 'Uncategorized',
      description: description || 'Please edit this product to add details.',
      countInStock: countInStock || 0,
      type: type || 'single',
      tags: Array.isArray(tags) ? tags : [],
      basketItems: Array.isArray(basketItems) ? basketItems : []
    });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { name, price, description, images, category, countInStock, type, tags, basketItems } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      if (name) product.name = name;
      if (price !== undefined) product.price = price;
      if (Array.isArray(images)) product.images = images;
      if (category) product.category = category;
      if (description) product.description = description;
      if (countInStock !== undefined) product.countInStock = countInStock;
      if (type) product.type = type;
      if (tags) product.tags = tags;
      if (basketItems) product.basketItems = basketItems;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.deleteOne(); // Mongoose 6+ schema.deleteOne
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============ USERS ============
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCustomerProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'Customer not found' });
    
    // Fetch all orders for this user
    const orders = await import('../models/Order.js').then(m => m.default.find({ user: req.params.id }).sort({ createdAt: -1 }));
    res.json({ user, orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============ SETTINGS ============
export const updateSettings = async (req, res) => {
  try {
    const { deliveryCharge, upiId, qrImageUrl } = req.body;
    let settings = await Settings.findOne();
    if (!settings) settings = new Settings();

    if (deliveryCharge !== undefined) settings.deliveryCharge = deliveryCharge;
    if (upiId !== undefined) settings.upiId = upiId;
    if (qrImageUrl !== undefined) settings.qrImageUrl = qrImageUrl;

    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============ SECURITY / CREDENTIALS ============

export const requestCredentialChange = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    admin.otp = otp;
    admin.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 mins
    await admin.save();

    // Verify SMTP config exists
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error('[SMTP] Missing SMTP environment variables');
      return res.status(500).json({ message: 'Email service is not configured on the server.' });
    }

    const transporter = createTransporter();

    const smtpUser = process.env.SMTP_USER?.trim();
    const mailOptions = {
      from: `"Diwedi Security" <${smtpUser}>`,
      to: process.env.ADMIN_EMAIL?.trim() || admin.email,
      subject: 'Diwedi Admin — Verification Code',
      text: `Your security verification code is: ${otp}. It expires in 10 minutes. Do not share it.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 24px; color: #333; max-width: 480px;">
          <h2 style="color: #1d4ed8; margin-bottom: 8px;">Diwedi Fruit Shop</h2>
          <p style="color: #666;">You requested an admin credential update. Use the code below:</p>
          <div style="margin: 24px 0; text-align: center;">
            <span style="display: inline-block; font-size: 32px; font-weight: 800; color: #e11d48; letter-spacing: 8px; background: #fff1f2; padding: 12px 24px; border-radius: 10px; border: 2px dashed #fecdd3;">${otp}</span>
          </div>
          <p style="color: #9ca3af; font-size: 12px;">This code expires in <strong>10 minutes</strong>. Do not share it with anyone.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'Verification OTP sent to your current active email.' });
  } catch (error) {
    console.error('[requestCredentialChange] SMTP Error:', error.message, error.code || '');
    res.status(500).json({ message: `Email delivery failed: ${error.message}` });
  }
};

export const verifyCredentialChange = async (req, res) => {
  try {
    const { otp, newEmail, newPassword } = req.body;
    const admin = await Admin.findById(req.admin._id);

    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    
    if (!admin.otp || admin.otp !== otp) {
      return res.status(401).json({ message: 'Invalid Verification Code' });
    }

    if (Date.now() > admin.otpExpiry) {
       admin.otp = undefined;
       admin.otpExpiry = undefined;
       await admin.save();
       return res.status(401).json({ message: 'Verification Code Expired' });
    }

    // Overwrite Credentials safely
    admin.email = newEmail;
    admin.password = newPassword; // The Mongoose pre-save hook automatically bcrypts this
    
    // Invalidate OTP immediately to prevent reuse
    admin.otp = undefined;
    admin.otpExpiry = undefined;
    
    await admin.save();

    res.json({ message: 'Credentials Updated Successfully!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
