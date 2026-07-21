import mongoose from 'mongoose';

export const connectDatabase = async () => {
  const mongoURI = process.env.MONGO_URI;
  if (!mongoURI) {
    throw new Error('MONGO_URI is not defined in environment variables');
  }

  try {
    const conn = await mongoose.connect(mongoURI);
    console.log(`[Database] Connected to MongoDB Atlas: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[Database] Connection Error: ${error.message}`);
    process.exit(1);
  }
};
