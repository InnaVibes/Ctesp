import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/pt_platform');
    console.log('📦 MongoDB Connected');
  } catch (error) {
    console.error('Database connection failed', error);
    process.exit(1);
  }
};