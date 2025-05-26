import GuestBooking from '../models/GuestBookingModel.js';

export const createGuestBooking = async (req, res, next) => {
    try {
        const gb = await GuestBooking.create(req.body);
        res.status(201).json(gb);
    } catch (err) {
        next(err);
    }
};

export const getGuestBookings = async (req, res, next) => {
    try {
        const gbs = await GuestBooking.find();
        res.json(gbs);
    } catch (err) {
        next(err);
    }
};

export const updateGuestBooking = async (req, res, next) => {
    try {
        const gb = await GuestBooking.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
        res.json(gb);
    } catch (err) {
        next(err);
    }
};

export const deleteGuestBooking = async (req, res, next) => {
    try {
        await GuestBooking.findOneAndDelete({ id: req.params.id });
        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
};
