// index.js
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

// DB & auth
import connectDB from './config/db.js';
import { protect } from './middleware/authMiddleware.js';

// Routes
import authRouter from './routes/auth.js';
import userRouter from './routes/userRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';
import guestBookingRouter from './routes/guestBookingRoutes.js';
import menuRouter from './routes/menuRoutes.js';
import offDayRouter from './routes/offDayRoutes.js';
import rebateRouter from './routes/rebateRoutes.js';

dotenv.config();

const startServer = async () => {
    // 1. Connect to MongoDB
    await connectDB();

    // 2. Initialize Express
    const app = express();

    // Allow requests from your React app's origin
    const corsOptions = {
        origin: process.env.CLIENT_URL || 'http://localhost:5173', // React's default port
        credentials: true, // Enable cookies/sessions if needed
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
        allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    };
    // 3. Global middleware
    app.use(cors(corsOptions));
    app.use(express.json());
    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    }

    // 4. Public routes
    app.use('/api/auth', authRouter);

    // 5. Protected routes (all require a valid Bearer token)
    app.use('/api/users', protect, userRouter);

    app.use('/api/bookings', protect, bookingRouter);
    app.use('/api/guest-bookings', protect, guestBookingRouter);
    app.use('/api/menu', protect, menuRouter);
    app.use('/api/off-days', protect, offDayRouter);
    app.use('/api/rebates', protect, rebateRouter);

    // 6. Error handler
    app.use((err, req, res, next) => {
        const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
        res.status(statusCode).json({
            message: err.message,
            stack: process.env.NODE_ENV === 'production' ? null : err.stack
        });
    });

    // 7. Start server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
};

startServer();
