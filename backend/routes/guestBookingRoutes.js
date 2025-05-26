import express from 'express';
import { createGuestBooking, getGuestBookings, updateGuestBooking, deleteGuestBooking } from '../controllers/guestBookingController.js';

const guestBookingRouter = express.Router();
guestBookingRouter.get('/', getGuestBookings);
guestBookingRouter.post('/', createGuestBooking);
guestBookingRouter.put('/:id', updateGuestBooking);
guestBookingRouter.delete('/:id', deleteGuestBooking);

export default guestBookingRouter;