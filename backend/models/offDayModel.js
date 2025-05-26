import mongoose from 'mongoose';

const OffDaySchema = new mongoose.Schema({
    date: { type: Date, required: true, unique: true },
    reason: { type: String, required: true }
});

const OffDay = mongoose.model('OffDay', OffDaySchema);
export default OffDay;