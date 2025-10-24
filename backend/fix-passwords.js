import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Admin from './models/admin.js';
import dotenv from 'dotenv';

dotenv.config();

async function fixAdminPasswords() {
  try {
    console.log('🛠️ Fixing Admin Passwords...');

    const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/univoice";
    await mongoose.connect(uri);
    console.log('✅ Database connected');

    // Get all admins
    const admins = await Admin.find({});
    console.log(`📋 Found ${admins.length} admins`);

    for (const admin of admins) {
      console.log(`🔍 Checking admin: ${admin.email}`);

      // Check if password is already hashed (bcrypt hashes start with $2b$ or $2a$)
      if (!admin.password || !admin.password.startsWith('$2')) {
        console.log(`🔧 Hashing password for ${admin.email}`);
        const hashedPassword = await bcrypt.hash('test123', 10);
        admin.password = hashedPassword;
        await admin.save();
        console.log(`✅ Password hashed for ${admin.email}`);
      } else {
        console.log(`✅ Password already hashed for ${admin.email}`);
      }
    }

    // Test login with one admin
    const testAdmin = admins[0];
    if (testAdmin) {
      console.log(`\n🧪 Testing login for ${testAdmin.email}...`);
      const isValidPassword = await bcrypt.compare('test123', testAdmin.password);
      console.log(`📋 Password valid: ${isValidPassword}`);

      if (isValidPassword) {
        console.log('✅ Password verification successful!');
      } else {
        console.log('❌ Password verification failed!');
      }
    }

    await mongoose.disconnect();
    console.log('✅ Database disconnected');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('❌ Full error:', error);
  }
}

fixAdminPasswords();
