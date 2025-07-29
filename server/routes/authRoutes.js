// server/routes/authRoutes.js
import express from 'express';
import passport from 'passport';
import { getCurrentUser, logout, manualLogin } from '../controllers/authController.js';
import { ensureAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/google', (req, res, next) => {
  const intent = req.query.intent || 'login';
  // attach to session (or temp query) so it reaches the strategy
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    state: intent   // 👈 pass intent via `state` param
  })(req, res, next);
});

router.get('/google/callback',
    (req, res, next) => {
        console.log('🔁 Google Callback hit');
        next();
    },
    passport.authenticate('google', { failureRedirect: 'http://localhost:5173/login?error=oauth' }),
    (req, res) => {
        res.redirect('http://localhost:5173/google-redirect');
    }
);

router.post('/login', manualLogin);

router.get('/current-user', ensureAuth ,getCurrentUser);

router.get('/logout', logout);

export default router;