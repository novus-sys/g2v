import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { config } from '../config';

dotenv.config();

async function testConnection() {
  try {
    console.log('Attempting to connect to MongoDB...');
    const conn = await mongoose.connect(config.MONGODB_URI);
    console.log('MongoDB Connected Successfully!');
    console.log(`Host: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
    
    // Test write operation
    const collection = conn.connection.collection('connection_test');
    await collection.insertOne({ test: true, timestamp: new Date() });
    console.log('Test write operation successful!');
    
    // Clean up
    await collection.deleteOne({ test: true });
    console.log('Test cleanup successful!');
    
    await mongoose.disconnect();
    console.log('Connection closed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

testConnection(); 