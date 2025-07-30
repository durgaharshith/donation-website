// server/config/passport.js
import passport from "passport";
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
  passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, done) => {
  const intent = req.query.state || 'login';

  try {
    let user = await User.findOne({ googleId: profile.id });

    if (!user) {
      const existingUserByEmail = await User.findOne({ email: profile.emails[0].value });

      if (existingUserByEmail) {
        existingUserByEmail.googleId = profile.id;
        await existingUserByEmail.save();
        user = existingUserByEmail;
      } else {
        if (intent === 'login') {
          return done(null, false, { message: "Account doesn't exist. Please Sign In first." });
        }

        user = await User.create({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          profilePic: profile.photos[0].value,
        });
      }
    }

    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
