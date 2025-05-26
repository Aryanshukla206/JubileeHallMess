import Rebate from '../models/rebateModel.js';

// List all rebates
export const getRebates = async (req, res, next) => {
    try {
        const rebates = await Rebate.find();
        res.json(rebates);
    } catch (err) {
        next(err);
    }
};

// Apply for a rebate
export const createRebate = async (req, res, next) => {
    try {
        const rebate = await Rebate.create(req.body);
        res.status(201).json(rebate);
    } catch (err) {
        next(err);
    }
};

// Update rebate status
export const updateRebate = async (req, res, next) => {
    try {
        const rebate = await Rebate.findOneAndUpdate(
            { id: req.params.id },
            req.body,
            { new: true }
        );
        res.json(rebate);
    } catch (err) {
        next(err);
    }
};

// Delete a rebate
export const deleteRebate = async (req, res, next) => {
    try {
        await Rebate.findOneAndDelete({ id: req.params.id });
        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
};