import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const connectDB = async () => {
    const uri = "mongodb+srv://aryanmsc23du:9UDZZrK0v6yUVKIS@cluster0.q6vnfiz.mongodb.net/Mess?retryWrites=true&w=majority&appName=Cluster0";
    if (!uri) {
        console.error('Error: MONGO_URI not defined in .env');
        process.exit(1);
    }

    try {
        const conn = await mongoose.connect(uri);
        // //console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
