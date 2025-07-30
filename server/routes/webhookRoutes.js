// server/routes/webhookRoutes.js
import express from 'express';
import crypto from 'crypto';
import Donation from '../models/Donation.js';

const router = express.Router();

// Handle Razorpay Webhook
router.post(
  '/razorpay',
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf; // Required for signature verification
    },
  }),
  async (req, res) => {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers['x-razorpay-signature'];

    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(req.rawBody)
      .digest('hex');

    if (signature !== expectedSignature) {
      return res.status(400).send('Invalid signature');
    }

    const event = req.body.event;

    if (event === 'payment.captured') {
      const payment = req.body.payload.payment.entity;

      try {
        const updatedDonation = await Donation.findOneAndUpdate(
          { orderId: payment.order_id },
          {
            paymentStatus: 'completed',
            paymentId: payment.id,
            paymentMethod: payment.method,
          },
          { new: true }
        );

        return res.json({ status: 'ok', updated: !!updatedDonation });
      } catch (err) {
        return res.status(500).json({ error: 'Internal server error' });
      }
    }

    res.status(200).send('Event ignored');
  }
);

export default router;
