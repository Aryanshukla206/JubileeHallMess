import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        // password.trim();
        // const user = await User.findOne({ email });
        // When finding user, explicitly select password
        const user = await User.findOne({ email }).select('+password');
        // console.log(user, "user from authController.js");
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        // const valid = await bcrypt.compare(password, user.password);
        const valid = password === user.password;
        // console.log(password, "user password--->", user.password, "end");
        // console.log(valid)
        if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // res.json({ token, user: { id: user._id, email: user.email, name: user.name, role: user.role } });
        const { password: _, ...userWithoutPassword } = user.toObject();

        res.json({
            token,
            user: userWithoutPassword
        });
    } catch (err) {
        next(err);
    }
};