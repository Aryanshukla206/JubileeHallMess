// models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    // You can drop the manual `id` field and use Mongo’s _id if you prefer.
    id: { type: Number, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    role: { type: String, enum: ['resident', 'admin'], default: 'resident' },

    // Store a bcrypt hash here
    // password: { type: String, required: true }
    password: {
        type: String,
        required: true,
        select: false  // Important for security
    }
}, {
    timestamps: true
});
// In your User model (MUST include this pre-save hook)
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    console.log(object)

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

const User = mongoose.model('User', UserSchema);
export default User;
