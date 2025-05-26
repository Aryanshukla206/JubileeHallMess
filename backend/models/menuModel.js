import mongoose from 'mongoose';

const DayMenuSchema = new mongoose.Schema({
    breakfast: [String],
    lunch: [String],
    dinner: [String]
}, { _id: false });

const MenuSchema = new mongoose.Schema({
    monday: DayMenuSchema,
    tuesday: DayMenuSchema,
    wednesday: DayMenuSchema,
    thursday: DayMenuSchema,
    friday: DayMenuSchema,
    saturday: DayMenuSchema,
    sunday: DayMenuSchema
});

const Menu = mongoose.model('Menu', MenuSchema);
export default Menu;