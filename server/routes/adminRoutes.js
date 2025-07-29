// server/routes/adminRoutes.js
import express from 'express';
import { ensureAdmin } from '../middleware/admin.js';
import { ensureAuth } from '../middleware/auth.js';
import { getAllDonations, getAllUsers } from '../controllers/adminController.js';

const router = express.Router();

router.get('/donations', ensureAuth, ensureAdmin, getAllDonations);
router.get('/users', ensureAuth, ensureAdmin, getAllUsers);

export default router;