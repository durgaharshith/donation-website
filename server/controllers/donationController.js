import Donation from '../models/Donation.js';
import Razorpay from 'razorpay';
import dotenv from 'dotenv';

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

export const createDonation = async (req, res) => {
  try {
    const { amount, donorName, donorEmail, message } = req.body;

    if (!amount || !donorName || !donorEmail) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const options = {
      amount: amount * 100,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1
    };

    const order = await razorpay.orders.create(options);

    const newDonation = new Donation({
      amount,
      donorName,
      donorEmail,
      message,
      orderId: order.id,
      userId: req.user._id || null
    });

    await newDonation.save();

    res.status(201).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      donation: newDonation._id
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateDonationStatus = async (req, res) => {
  const { donationId, paymentId, paymentStatus } = req.body;
  try {
    const donation = await Donation.findByIdAndUpdate(
      donationId,
      { paymentId, paymentStatus },
      { new: true }
    );
    res.status(200).json({
      message: "Donation status updated successfully",
      donation
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMyDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(donations);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
