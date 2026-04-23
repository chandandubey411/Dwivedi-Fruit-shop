import express from 'express';
import { getSettings } from '../controllers/settingsController.js';

const router = express.Router();

router.route('/').get(getSettings);

export default router;
