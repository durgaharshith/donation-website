// server/controllers/userController.js
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

export const setPassword = async (req, res) => {
    const {userId, password} = req.body;
    try{
        const hash = await bcrypt.hash(password, 10);
        await User.findByIdAndUpdate(userId, {password: hash});
        res.status(200).json({message: "Password set successfully"});
    }catch(err){
        res.status(500).json({message: "Failed to set password", error: err.message});
    }
};