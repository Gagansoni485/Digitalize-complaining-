import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Admin from './models/admin.js';
import dotenv from 'dotenv';

dotenv.config();

async function createTestAdmin() {
  try {
    console.log('🆕 Creating Fresh Test Admin...');

    const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/univoice";
    await mongoose.connect(uri);
    console.log('✅ Database connected');

    // Delete existing test admin if it exists
    await Admin.deleteOne({ email: 'testadmin@univoice.com' });
    console.log('🗑️ Deleted existing test admin');

    // Create new test admin with known password
    const testPassword = 'test123';
    const hashedPassword = await bcrypt.hash(testPassword, 10);

    const testAdmin = await Admin.create({
      name: 'Test Admin',
      email: 'testadmin@univoice.com',
      password: hashedPassword,
      department: 'CSE',
      employeeId: 'TEST001',
      role: 'admin',
      specializations: ['general'],
      branches: 'CSE',
      semesters: 5,
      maxCaseLoad: 50,
      isActive: true,
      currentCaseLoad: 0
    });

    console.log('✅ Test admin created successfully');
    console.log(`📋 Admin ID: ${testAdmin._id}`);
    console.log(`📋 Email: ${testAdmin.email}`);
    console.log(`📋 Password: ${testPassword}`);
    console.log(`📋 Hashed Password: ${testAdmin.password}`);

    // Test login
    console.log('\n🧪 Testing login...');
    const isValidPassword = await bcrypt.compare(testPassword, testAdmin.password);

    if (isValidPassword) {
      console.log('✅ Password verification successful!');
    } else {
      console.log('❌ Password verification failed!');
    }

    await mongoose.disconnect();
    console.log('✅ Database disconnected');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('❌ Full error:', error);
  }
}

createTestAdmin();
