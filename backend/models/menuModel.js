import mongoose from 'mongoose';

const menuSchema = mongoose.Schema(
    {
        day: {
            type: String,
            required: true,
            enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        },
        breakfast: [String],
        lunch: [String],
        dinner: [String],
    },
    {
        timestamps: true,
    }
);

const Menu = mongoose.model('Menu', menuSchema);

export default Menu;