/**
 * ===================================
 * MODEL: REMINDER - NHẮC NHỞ
 * ===================================
 * Model này lưu trữ các nhắc nhở của người dùng
 * Ví dụ: nhắc uống thuốc, tập thể dục, ngủ đúng giờ...
 */

const mongoose = require('mongoose');

// Định nghĩa Schema cho Reminder
const reminderSchema = new mongoose.Schema({
    // Tham chiếu đến User - ai tạo nhắc nhở này
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Nhắc nhở phải thuộc về một người dùng']
    },

    // Tiêu đề nhắc nhở
    title: {
        type: String,
        required: [true, 'Vui lòng nhập tiêu đề nhắc nhở'],
        maxlength: [100, 'Tiêu đề không được quá 100 ký tự']
    },

    // Mô tả chi tiết
    description: {
        type: String,
        maxlength: [500, 'Mô tả không được quá 500 ký tự']
    },

    // Loại nhắc nhở
    type: {
        type: String,
        enum: ['medicine', 'exercise', 'sleep', 'water', 'meal', 'checkup', 'other'],
        default: 'other'
    },

    // Thời gian nhắc (giờ:phút)
    time: {
        type: String,
        required: [true, 'Vui lòng nhập thời gian nhắc nhở'],
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Định dạng thời gian không hợp lệ (HH:MM)']
    },

    // Các ngày trong tuần cần nhắc (0 = Chủ nhật, 1-6 = Thứ 2 - Thứ 7)
    daysOfWeek: [{
        type: Number,
        min: 0,
        max: 6
    }],

    // Trạng thái hoạt động
    isActive: {
        type: Boolean,
        default: true
    },

    // Ngày tạo
    createdAt: {
        type: Date,
        default: Date.now
    },

    // Ngày cập nhật
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Cập nhật updatedAt trước khi save
reminderSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Index để tìm kiếm nhanh
reminderSchema.index({ userId: 1, isActive: 1 });

// Tạo và export Model
const Reminder = mongoose.model('Reminder', reminderSchema);

module.exports = Reminder;
