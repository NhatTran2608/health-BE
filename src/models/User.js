/**
 * ===================================
 * MODEL: USER - NGƯỜI DÙNG
 * ===================================
 * Model này lưu trữ thông tin người dùng trong hệ thống
 * Bao gồm: thông tin cá nhân, hồ sơ sức khỏe cơ bản, lối sống
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Định nghĩa Schema cho User
const userSchema = new mongoose.Schema({
    // Họ tên người dùng
    name: {
        type: String,
        required: [true, 'Vui lòng nhập họ tên'],
        trim: true,
        maxlength: [100, 'Họ tên không được quá 100 ký tự']
    },

    // Email - dùng để đăng nhập
    email: {
        type: String,
        required: [true, 'Vui lòng nhập email'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Vui lòng nhập email hợp lệ'
        ]
    },

    // Mật khẩu - sẽ được hash trước khi lưu
    password: {
        type: String,
        required: [true, 'Vui lòng nhập mật khẩu'],
        minlength: [6, 'Mật khẩu phải có ít nhất 6 ký tự'],
        select: false // Không trả về password khi query
    },

    // Tuổi
    age: {
        type: Number,
        min: [1, 'Tuổi phải lớn hơn 0'],
        max: [150, 'Tuổi không hợp lệ']
    },

    // Giới tính
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        default: 'other'
    },

    // Chiều cao (cm)
    height: {
        type: Number,
        min: [0, 'Chiều cao không hợp lệ']
    },

    // Cân nặng (kg)
    weight: {
        type: Number,
        min: [0, 'Cân nặng không hợp lệ']
    },

    // Tiền sử bệnh
    medicalHistory: {
        type: String,
        maxlength: [1000, 'Tiền sử bệnh không được quá 1000 ký tự']
    },

    // Lối sống (ăn uống, tập luyện, ngủ nghỉ...)
    lifestyle: {
        diet: {
            type: String,
            enum: ['healthy', 'normal', 'unhealthy'],
            default: 'normal'
        },
        exercise: {
            type: String,
            enum: ['regular', 'sometimes', 'rarely'],
            default: 'sometimes'
        },
        sleep: {
            type: String,
            enum: ['good', 'average', 'poor'],
            default: 'average'
        },
        smoking: {
            type: Boolean,
            default: false
        },
        alcohol: {
            type: Boolean,
            default: false
        }
    },

    // Vai trò người dùng
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },

    // Ngày tạo tài khoản
    createdAt: {
        type: Date,
        default: Date.now
    }
});

/**
 * Middleware: Hash password trước khi lưu
 * Chỉ hash khi password được thay đổi
 */
userSchema.pre('save', async function (next) {
    // Nếu password không được sửa đổi, bỏ qua
    if (!this.isModified('password')) {
        next();
    }

    // Tạo salt và hash password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

/**
 * Method: So sánh password nhập vào với password đã hash
 * @param {string} enteredPassword - Password người dùng nhập
 * @returns {boolean} - true nếu khớp, false nếu không
 */
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Tạo và export Model
const User = mongoose.model('User', userSchema);

module.exports = User;
