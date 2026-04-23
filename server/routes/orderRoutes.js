import express from 'express';
import { createOrder, getUserOrders, updateOrderToPaymentPending, getOrderById, markOrderPaid } from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createOrder);

router.route('/my-orders')
  .get(protect, getUserOrders);

router.route('/:id')
  .get(protect, getOrderById);

router.route('/:id/payment')
  .put(protect, updateOrderToPaymentPending);

router.route('/:id/mark-paid')
  .put(protect, markOrderPaid);

export default router;
