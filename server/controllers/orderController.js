import Order from '../models/Order.js';

export const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      deliveryCharge,
      totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      deliveryCharge,
      totalPrice,
      isUPIVerificationPending: paymentMethod === 'UPI',
    });

    const createdOrder = await order.save();

    // Save address to user profile if requested
    if (req.body.saveAddress && shippingAddress) {
      try {
        const { default: User } = await import('../models/User.js');
        const user = await User.findById(req.user._id);
        if (user) {
          const isDuplicate = user.addresses.some(a => 
            a.street === shippingAddress.street && 
            a.city === shippingAddress.city && 
            a.state === shippingAddress.state && 
            a.zip === shippingAddress.zip
          );
          if (!isDuplicate) {
            user.addresses.push(shippingAddress);
            await user.save();
          }
        }
      } catch (err) {
        console.error("Error saving user address:", err);
      }
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderToPaymentPending = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      if(order.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized to update this order' });
      }
      
      order.paymentStatus = 'Payment Pending Verification';
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name phone');
    if (order) {
      if(order.user._id.toString() !== req.user._id.toString()) {
         return res.status(401).json({ message: 'Not authorized to view this order' });
      }
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch(error) {
    res.status(500).json({ message: error.message });
  }
};

export const markOrderPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to modify this order' });
    }

    if (order.hasUserMarkedPaid) {
      return res.status(400).json({ message: 'Already marked as paid' });
    }

    order.hasUserMarkedPaid = true;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
