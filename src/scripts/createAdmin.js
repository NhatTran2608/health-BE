/**
 * ===================================
 * SCRIPT: TẠO TÀI KHOẢN ADMIN
 * ===================================
 * Script này tạo tài khoản admin để test hệ thống
 * Chạy: node src/scripts/createAdmin.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const createAdmin = async () => {
    try {
        // Kết nối MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✓ Đã kết nối MongoDB');

        // Kiểm tra admin đã tồn tại chưa
        const existingAdmin = await User.findOne({ email: 'admin@gmail.com' });
        if (existingAdmin) {
            console.log('⚠ Admin đã tồn tại!');
            console.log('Email:', existingAdmin.email);
            console.log('Role:', existingAdmin.role);
            process.exit(0);
        }

        // Tạo tài khoản admin mới
        const admin = await User.create({
            name: 'Administrator',
            email: 'admin@gmail.com',
            password: 'Admin123@', // Password sẽ được hash tự động trong model
            role: 'admin',
            phone: '0123456789',
            gender: 'male',
            dateOfBirth: new Date('1990-01-01')
        });

        console.log('✓ Tạo tài khoản admin thành công!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📧 Email:', admin.email);
        console.log('🔑 Password: Admin123@');
        console.log('👤 Role:', admin.role);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        process.exit(0);
    } catch (error) {
        console.error('❌ Lỗi:', error.message);
        process.exit(1);
    }
};

// Chạy script
createAdmin();
