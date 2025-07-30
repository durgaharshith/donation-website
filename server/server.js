// server/server.js
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';

import './config/passport.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import donationRoutes from './routes/donationRoutes.js';
import webhookRoutes from './routes/webhookRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { markStaleDonationsAsFailed } from './utils/checkStaleDonations.js';

// Load environment variables
dotenv.config();

const app = express();

// Enable CORS for frontend origin
app.use(cors({
  origin: process.env.FRONTEND_URL?.split(',') || ['http://localhost:5173'],
  credentials: true
}));

// Webhook route must be placed before body-parser middleware
app.use('/api/webhook', webhookRoutes);

// Parse JSON bodies
app.use(express.json());

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    httpOnly: true
  }
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("Mongo Error:", err));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/admin', adminRoutes);

// Background job: check for stale donations every 1 minute
setInterval(markStaleDonationsAsFailed, 60 * 1000);

// Root route
app.get('/', (req, res) => {
  res.send("Donation backend running");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
