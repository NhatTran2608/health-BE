/**
 * ===================================
 * MODEL: DOCTOR - BÁC SĨ
 * ===================================
 * Model này lưu trữ thông tin bác sĩ
 */

const mongoose = require('mongoose');

// Định nghĩa Schema cho Doctor
const doctorSchema = new mongoose.Schema({
    // Tên bác sĩ
    name: {
        type: String,
        required: [true, 'Vui lòng nhập tên bác sĩ'],
        trim: true,
        maxlength: [100, 'Tên không được quá 100 ký tự']
    },

    // Chuyên khoa
    specialty: {
        type: String,
        required: [true, 'Vui lòng nhập chuyên khoa'],
        trim: true,
        maxlength: [100, 'Chuyên khoa không được quá 100 ký tự']
    },

    // Trình độ
    qualification: {
        type: String,
        required: [true, 'Vui lòng nhập trình độ'],
        trim: true,
        maxlength: [200, 'Trình độ không được quá 200 ký tự']
    },

    // Ảnh bác sĩ (URL)
    image: {
        type: String,
        default: ''
    },

    // Khung giờ khám (mảng các khung giờ)
    // Ví dụ: ["08:00-10:00", "14:00-16:00"]
    availableSlots: [{
        type: String,
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]-([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Định dạng khung giờ không hợp lệ (HH:MM-HH:MM)']
    }],

    // Trạng thái
    status: {
        type: String,
        enum: ['available', 'busy'],
        default: 'available'
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
doctorSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Index để tìm kiếm nhanh
doctorSchema.index({ specialty: 1, status: 1 });

// Tạo và export Model
const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;

