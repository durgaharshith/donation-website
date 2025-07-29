//server/controllers/adminController.js
import Donation from '../models/Donation.js';
import User from '../models/User.js';

export const getAllDonations = async (req, res) => {
    try{
        const  donations = await Donation.find().populate('userId').sort({createdAt: -1});
        
        res.json(donations);
    }catch(err){
        res.status(500).json({error: 'Failed to fetch donations', details: err.message})
    }
}

export const getAllUsers = async (req, res) => {
  try {
    // Fetch all users except admins if needed
    const users = await User.find({ role: { $ne: 'admin' } });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};
