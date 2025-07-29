// server/routes/donationRoutes.js
import express from 'express';
import { createDonation, updateDonationStatus, getMyDonations } from '../controllers/donationController.js';
import { ensureAuth } from '../middleware/auth.js';

const router = express.Router();

// Route to create a new donation
router.post('/create', ensureAuth, createDonation);
// Route to get all donations made by the authenticated user
router.get('/my-donations', ensureAuth, getMyDonations);
// Route to update the status of a donation
router.post('/update-status', ensureAuth, updateDonationStatus);


// Export the router
export default router;