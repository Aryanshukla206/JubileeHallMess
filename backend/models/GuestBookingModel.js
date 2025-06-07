import mongoose from 'mongoose';
import Counter from './counterModel.js';

const GuestBookingSchema = new mongoose.Schema({
    bookingNumber: { type: Number, required: true, unique: true },
    userName: { type: String, required: true },
    contactNumber: { type: String, required: true },
    mealType: { type: String, enum: ['breakfast', 'lunch', 'dinner'], required: true },
    date: { type: Date, required: true },
    quantities: { type: Map, of: Number, required: true },
    hasDiscount: { type: Boolean, default: false },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
    isGuest: { type: Boolean, default: true },
    timestamp: { type: Date, default: Date.now }
});
GuestBookingSchema.pre('validate', async function (next) {
    if (this.isNew && !this.bookingNumber) {
        const counter = await Counter.findByIdAndUpdate(
            { _id: 'guestBooking' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        this.bookingNumber = counter.seq;
    }
    next();
});
const GuestBooking = mongoose.model('GuestBooking', GuestBookingSchema);
export default GuestBooking;