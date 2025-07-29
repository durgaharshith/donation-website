// server/routes/webhookRoutes.js
import express from 'express';
import crypto from 'crypto';
import Donation from '../models/Donation.js';

const router = express.Router();

// Route to create a new donation
router.post('/razorpay', express.json({verify: (req, res, buf) => {req.rawBody = buf}}), async (req, res) => {
    const webhoookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers['x-razorpay-signature'];

    const expectedSignature = crypto.createHmac('sha256', webhoookSecret)
        .update(req.rawBody)
        .digest('hex');

    if(signature !== expectedSignature) {
        console.log('Invalid Razorpay webhook signature');
        return res.status(400).send('Invalid signature');
    }

    const event = req.body.event;
    if(req.body.event === 'payment.captured'){
        const payment = req.body.payload.payment.entity;

        try{
            const donation = await Donation.findOneAndUpdate(
                {orderId: payment.order_id},
                {
                    paymentStatus: 'completed',
                    paymentId: payment.id,
                    paymentMethod: payment.method
                },
                {new: true}
            );
            if(donation) {
                console.log('Donation updated successfully:', donation);
            }else{
                console.log('Donation not found for order ID:', payment.order_id);
            }
            res.json({status: 'ok'});
        }catch(err) {
            console.error('Error updating donation:', err);
            res.status(500).json({error: 'Internal server error'});
        }
    }else{
        res.status(200).send('Even Ignored');
    }
});

export default router;