import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/user.js';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from '../config/database.js';
import readline from 'readline';

//this script creates an admin user in the database

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../../.env') });

const createAdmin = async () => {
    try {
        await connectDB();
        console.log('Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL });
        
        if (existingAdmin) {
            console.log('Admin user already exists');
            console.log('Email:', existingAdmin.email);
            console.log('Role:', existingAdmin.role);
            
            // what this does is that it prompts the user if they want to update the password
            // readline module is used to get input from command linexc
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });

            rl.question('Update password? (yes/no): ', async (answer) => {
                if (answer.toLowerCase() === 'yes') {
                    rl.question('Enter new password: ', async (newPassword) => {
                        existingAdmin.password = newPassword; // Will be hashed by pre-save middleware
                        await existingAdmin.save(); // save updated admin record
                        console.log('Password updated successfully!');
                        rl.close();
                        process.exit(0);
                    });
                } else {
                    rl.close();
                    process.exit(0);
                }
            });
        } else {
            // Create new admin
            const adminPassword = process.argv[2]; // where the password input is located
            
            if (!adminPassword) {
                console.error('Please provide a password as argument or set ADMIN_DEFAULT_PASSWORD in .env');
                process.exit(1);
            }

            const admin = new User({
                email: process.env.ADMIN_EMAIL,
                password: adminPassword, // Will be hashed by pre-save middleware
                role: 'admin',
                firstName: 'Admin',
                lastName: 'User'
            });

            await admin.save();
            console.log('✓ Admin user created successfully!');
            console.log('Email:', admin.email);
            console.log('Role:', admin.role);
            process.exit(0);
        }
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();