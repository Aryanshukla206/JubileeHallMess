import express from 'express';
import asyncHandler from 'express-async-handler';
import Booking from '../models/bookingModel.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
router.post(
    '/',
    protect,
    asyncHandler(async (req, res) => {
        const { mealType, quantities, isVegetarian, date } = req.body;

        const booking = await Booking.create({
            user: req.user._id,
            mealType,
            quantities,
            isVegetarian,
            date,
        });

        res.status(201).json(booking);
    })
);

// @desc    Get bookings by date
// @route   GET /api/bookings
// @access  Private/Admin
router.get(
    '/',
    protect,
    admin,
    asyncHandler(async (req, res) => {
        const { date } = req.query;
        const bookings = await Booking.find({ date })
            .populate('user', 'name')
            .sort('-createdAt');
        res.json(bookings);
    })
);

// @desc    Update booking status
// @route   PUT /api/bookings/:id
// @access  Private/Admin
router.put(
    '/:id',
    protect,
    admin,
    asyncHandler(async (req, res) => {
        const booking = await Booking.findById(req.params.id);

        if (booking) {
            booking.status = req.body.status || booking.status;
            const updatedBooking = await booking.save();
            res.json(updatedBooking);
        } else {
            res.status(404);
            throw new Error('Booking not found');
        }
    })
);

export default router;