import Menu from '../models/menuModel.js';

// Get the current menu
export const getMenu = async (req, res, next) => {
    try {
        const menu = await Menu.findOne();
        res.json(menu);
    } catch (err) {
        next(err);
    }
};

// Update or create menu document
export const updateMenu = async (req, res, next) => {
    try {
        const menu = await Menu.findOneAndUpdate({}, req.body, { new: true, upsert: true });
        res.json(menu);
    } catch (err) {
        next(err);
    }
};