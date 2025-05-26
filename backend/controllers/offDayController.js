import OffDay from '../models/offDayModel.js';

// List all off-days
export const getOffDays = async (req, res, next) => {
    try {
        const days = await OffDay.find();
        res.json(days);
    } catch (err) {
        next(err);
    }
};

// Add a new off-day
export const createOffDay = async (req, res, next) => {
    try {
        const offDay = await OffDay.create(req.body);
        res.status(201).json(offDay);
    } catch (err) {
        next(err);
    }
};

// Update an off-day
export const updateOffDay = async (req, res, next) => {
    try {
        const offDay = await OffDay.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(offDay);
    } catch (err) {
        next(err);
    }
};

// Delete an off-day
export const deleteOffDay = async (req, res, next) => {
    try {
        await OffDay.findByIdAndDelete(req.params.id);
        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
};