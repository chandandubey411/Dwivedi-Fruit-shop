import express from 'express';
import { registerUser, loginUser, getUserProfile, saveAddress, deleteAddress, updateAddress } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.route('/profile')
  .get(protect, getUserProfile)
  .post(protect, saveAddress);

router.route('/profile/address/:id')
  .put(protect, updateAddress)
  .delete(protect, deleteAddress);

export default router;
