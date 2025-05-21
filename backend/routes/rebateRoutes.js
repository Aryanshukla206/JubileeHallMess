import express from 'express';
import asyncHandler from 'express-async-handler';
import Rebate from '../models/rebateModel.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Create new rebate application
// @route   POST /api/rebates
// @access  Private
router.post(
    '/',
    protect,
    asyncHandler(async (req, res) => {
        const { startDate, endDate, reason } = req.body;

        const rebate = await Rebate.create({
            user: req.user._id,
            startDate,
            endDate,
            reason,
        });

        res.status(201).json(rebate);
    })
);

// @desc    Get all rebates
// @route   GET /api/rebates
// @access  Private/Admin
router.get(
    '/',
    protect,
    admin,
    asyncHandler(async (req, res) => {
        const rebates = await Rebate.find({})
            .populate('user', 'name')
            .sort('-createdAt');
        res.json(rebates);
    })
);

// @desc    Update rebate status
// @route   PUT /api/rebates/:id
// @access  Private/Admin
router.put(
    '/:id',
    protect,
    admin,
    asyncHandler(async (req, res) => {
        const rebate = await Rebate.findById(req.params.id);

        if (rebate) {
            rebate.status = req.body.status || rebate.status;
            const updatedRebate = await rebate.save();
            res.json(updatedRebate);
        } else {
            res.status(404);
            throw new Error('Rebate not found');
        }
    })
);

export default router;