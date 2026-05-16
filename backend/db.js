const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  mongoose.set('strictQuery', true);

  if (isConnected) {
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false, // Disable buffering for serverless
    });

    isConnected = db.connections[0].readyState;
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

module.exports = connectDB;
