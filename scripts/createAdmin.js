// Run this script with: node scripts/createAdmin.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const UserSchema = new mongoose.Schema({
    email: String,
    password: String,
    role: String,
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function createAdmin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const adminEmail = 'admin@sweetshop.com';
        const adminPassword = 'admin123'; // Change this!

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminEmail });
        if (existingAdmin) {
            console.log('Admin user already exists!');
            process.exit(0);
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminPassword, salt);

        // Create admin user
        await User.create({
            email: adminEmail,
            password: hashedPassword,
            role: 'admin'
        });

        console.log('✅ Admin user created successfully!');
        console.log('Email:', adminEmail);
        console.log('Password:', adminPassword);
        console.log('\n⚠️  Please change the password after first login!');

        process.exit(0);
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
}

createAdmin();
