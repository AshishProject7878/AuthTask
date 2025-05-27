import User from '../Models/AuthModel.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../Libs/Utils.js';

// Register function
export const register = async (req, res) => {
    try {
        const { name, dob, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({ 
            name,
            dob,
            email,
            password: hashedPassword,
        });

        const token = generateToken(user._id);
        res.status(201).json({
            _id: user._id,
            name: user.name,
            dob: user.dob,
            email: user.email,
            token,
        });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

// Login function
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

        const token = generateToken(user._id);
        res.status(200).json({
            _id: user._id,
            name: user.name,
            dob: user.dob,
            email: user.email,
            token,
        });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

// Logout function
export const logout = async (req, res) => {
    try {
        res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};