import User from "../models/User.js";
import bcrypt from 'bcryptjs';

export const manualLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !user.googleId) {
      return res.status(400).json({ message: "Please use Google Sign-In to create your account first." });
    }

    if (!user.password) {
      return res.status(400).json({ message: "This account does not have a manual login setup." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Incorrect password" });

    req.login(user, (err) => {
      if (err) return res.status(500).json({ message: "Login failed" });
      res.status(200).json({ message: "Login successful", user });
    });

  } catch (err) {
    res.status(500).json({ message: "Login error", error: err.message });
  }
};

export const getCurrentUser = (req, res) => {
  res.status(200).json(req.user || null);
};

export const logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed", error: err.message });
    }

    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to destroy session", error: err.message });
      }

      res.clearCookie('connect.sid', {
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });

      res.status(200).json({ message: "Logged Out successfully" });
    });
  });
};
