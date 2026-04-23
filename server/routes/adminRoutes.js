import express from 'express';
import {
  loginAdmin,
  getAnalytics,
  getAllOrders,
  updateOrderStatus,
  updatePaymentStatus,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllUsers,
  getCustomerProfile,
  updateSettings,
  requestCredentialChange,
  verifyCredentialChange
} from '../controllers/adminController.js';
import { protectAdmin } from '../middleware/adminAuthMiddleware.js';

const router = express.Router();

router.post('/login', loginAdmin);

// Protected Admin Routes
router.route('/analytics').get(protectAdmin, getAnalytics);

router.route('/orders')
  .get(protectAdmin, getAllOrders);
router.route('/orders/:id/status')
  .put(protectAdmin, updateOrderStatus);
router.route('/orders/:id/payment')
  .put(protectAdmin, updatePaymentStatus);

router.route('/products')
  .post(protectAdmin, createProduct);
router.route('/products/:id')
  .put(protectAdmin, updateProduct)
  .delete(protectAdmin, deleteProduct);

router.route('/users')
  .get(protectAdmin, getAllUsers);
router.route('/customer/:id')
  .get(protectAdmin, getCustomerProfile);

router.route('/settings')
  .put(protectAdmin, updateSettings);

router.post('/request-credential-change', protectAdmin, requestCredentialChange);
router.post('/verify-credential-change', protectAdmin, verifyCredentialChange);

export default router;
