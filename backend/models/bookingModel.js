import mongoose from 'mongoose';

const bookingSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        mealType: {
            type: String,
            required: true,
            enum: ['breakfast', 'lunch', 'dinner'],
        },
        date: {
            type: Date,
            required: true,
        },
        quantities: {
            rice: { type: Number, default: 0 },
            dal: { type: Number, default: 0 },
            sabji: { type: Number, default: 0 },
            roti: { type: Number, default: 0 },
        },
        isVegetarian: {
            type: Boolean,
            required: true,
            default: true,
        },
        status: {
            type: String,
            required: true,
            enum: ['pending', 'completed'],
            default: 'pending',
        },
    },
    {
        timestamps: true,
    }
);

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;