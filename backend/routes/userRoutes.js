import express from 'express';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
router.post(
    '/login',
    asyncHandler(async (req, res) => {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                    expiresIn: '30d',
                }),
            });
        } else {
            res.status(401);
            throw new Error('Invalid email or password');
        }
    })
);

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
router.post(
    '/',
    asyncHandler(async (req, res) => {
        const { name, email, password, role } = req.body;
        const userExists = await User.findOne({ email });

        if (userExists) {
            res.status(400);
            throw new Error('User already exists');
        }

        const user = await User.create({
            name,
            email,
            password,
            role,
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                    expiresIn: '30d',
                }),
            });
        } else {
            res.status(400);
            throw new Error('Invalid user data');
        }
    })
);

export default router;