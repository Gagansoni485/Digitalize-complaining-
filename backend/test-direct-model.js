import mongoose from 'mongoose';
import Admin from './models/admin.js';
import dotenv from 'dotenv';

dotenv.config();

async function testDirectAdminCreation() {
  try {
    console.log('🧪 Testing Direct Admin Model Creation...');

    const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/univoice";
    await mongoose.connect(uri);
    console.log('✅ Database connected');

    const testAdmin = {
      name: 'Direct Test',
      email: 'directtest@univoice.com',
      password: 'hashedpassword',
      department: 'CSE',
      employeeId: 'DIRECT001',
      role: 'admin',
      specializations: ['general'],
      branches: 'CSE',
      semesters: 5,
      maxCaseLoad: 50,
      isActive: true,
      currentCaseLoad: 0
    };

    console.log('Creating admin with data:', testAdmin);

    const admin = await Admin.create(testAdmin);
    console.log('✅ Admin created successfully:', admin);

    await mongoose.disconnect();
    console.log('✅ Database disconnected');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('❌ Full error:', error);
  }
}

testDirectAdminCreation();
