import express from 'express';
import passport from 'passport';
import { getCurrentUser, logout, manualLogin } from '../controllers/authController.js';
import { ensureAuth } from '../middleware/auth.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Optional: Rate limiter to protect login
const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 min
  max: 10,
  message: { message: 'Too many login attempts. Try again later.' }
});

// Google OAuth Entry
router.get('/google', (req, res, next) => {
  const intent = req.query.intent || 'login';
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    state: intent
  })(req, res, next);
});

// Google OAuth Callback
router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=oauth`
  }),
  (req, res) => {
    res.redirect(`${process.env.FRONTEND_URL}/google-redirect`);
  }
);

// Manual Login (Rate-limited)
router.post('/login', loginLimiter, manualLogin);

// Session Check
router.get('/current-user', ensureAuth, getCurrentUser);

// Logout
router.get('/logout', logout);

export default router;
