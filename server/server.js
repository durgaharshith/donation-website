//server/server.js
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';

import './config/passport.js'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import donationRoutes from './routes/donationRoutes.js'
import webhookRoutes from './routes/webhookRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { markStaleDonationsAsFailed } from './utils/checkStaleDonations.js';
// Load environment variables
dotenv.config();
const app = express();


//enabling CORS
// This allows the frontend to communicate with the backend
app.use(cors({
  origin: process.env.FRONTEND_URL?.split(',') || ['http://localhost:5173'],
  credentials: true
}))

app.use('/api/webhook', webhookRoutes);

app.use(express.json());

//Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,            // <-- MUST be false for localhost HTTP
    sameSite: 'lax',          // lax is fine for now
    httpOnly: true
  }
}));
app.use(passport.initialize());
app.use(passport.session());
//DB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(()=>console.log("MongoDB Connected"))
  .catch((err)=>console.log("Mongo Error:", err));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/admin', adminRoutes);

setInterval(() => {
  markStaleDonationsAsFailed();
}, 60 * 1000); // Every 1 minute
//Test Route
app.get('/', (req, res)=>{
    res.send("Donation backend running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>console.log(`Server started on port ${PORT}`));

