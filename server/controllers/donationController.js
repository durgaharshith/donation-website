// server/controllers/donationController.js
import Donation from '../models/Donation.js';
import Razorpay from 'razorpay';
import dotenv from 'dotenv';

dotenv.config();

// @desc    Create new donation
// @route   POST /api/donations
// @access  Private
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

export const createDonation = async (req, res) => {
    try{
        const { amount, donorName, donorEmail, message } = req.body;

        // Validate input
        if (!amount || !donorName || !donorEmail) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Create a new Razorpay order
        const options = {
            amount: amount * 100, // Amount in paise
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
            payment_capture: 1 // Auto capture payment
        };
        const order = await razorpay.orders.create(options);
        // Create a new donation
        const newDonation = new Donation({
            amount,
            donorName,
            donorEmail,
            message,
            orderId: order.id,
            userId: req.user._id||null // Assuming user is authenticated and user ID is available
        });

        // Save the donation to the database
        await newDonation.save();

        res.status(201).json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            donation: newDonation._id
        });
    }catch(err) {
        console.error('Error creating donation:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}


//update donation status
export const updateDonationStatus = async (req, res) => {
    const {donationId, paymentId, paymentStatus} = req.body;
    try{
        const donation = await Donation.findByIdAndUpdate(
            donationId,
            {
                paymentId,
                paymentStatus
            },
            { new: true }
        );
        res.status(200).json({
            message: "Donation status updated successfully",
            donation
        });
    }catch(err){
        console.error('Error updating donation status:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}


// @desc    Get donations of the logged-in user
// @route   GET /api/donations/my
// @access  Private

export const getMyDonations = async (req, res) => {
    try {
        const donations = await Donation.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(donations);
    } catch (err) {
        console.error('Error fetching donations:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}