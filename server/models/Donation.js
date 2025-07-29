// server/models/Donation.js
import mongoose from "mongoose";

const donationSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    amount: {
        type: Number,
        required: true
    },
    donorName: {
        type: String,
        required: true
    },
    donorEmail: {
        type: String,
        required: true,
    },
    message: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true,
    },
    paymentId: { type: String }, // Razorpay payment_id
    orderId: { type: String },   // Razorpay order_id
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'cancelled'],
        default: 'pending'
    },
    paymentMethod: {
        type: String,
        default: "razorpay"
    }
}, { timestamps: true });

export default mongoose.model('Donation', donationSchema);