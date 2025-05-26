import mongoose from 'mongoose';

const GuestBookingSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    userName: { type: String, required: true },
    contactNumber: { type: String, required: true },
    mealType: { type: String, enum: ['breakfast', 'lunch', 'dinner'], required: true },
    date: { type: Date, required: true },
    quantities: { type: Map, of: Number, required: true },
    hasDiscount: { type: Boolean, default: false },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
    timestamp: { type: Date, default: Date.now }
});

const GuestBooking = mongoose.model('GuestBooking', GuestBookingSchema);
export default GuestBooking;