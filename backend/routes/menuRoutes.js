import express from 'express';
import asyncHandler from 'express-async-handler';
import Menu from '../models/menuModel.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get menu for all days
// @route   GET /api/menu
// @access  Public
router.get(
    '/',
    asyncHandler(async (req, res) => {
        const menu = await Menu.find({});
        res.json(menu);
    })
);

// @desc    Update menu for a day
// @route   PUT /api/menu/:day
// @access  Private/Admin
router.put(
    '/:day',
    protect,
    admin,
    asyncHandler(async (req, res) => {
        const { breakfast, lunch, dinner } = req.body;
        const menu = await Menu.findOne({ day: req.params.day });

        if (menu) {
            menu.breakfast = breakfast || menu.breakfast;
            menu.lunch = lunch || menu.lunch;
            menu.dinner = dinner || menu.dinner;

            const updatedMenu = await menu.save();
            res.json(updatedMenu);
        } else {
            res.status(404);
            throw new Error('Menu not found');
        }
    })
);

export default router;