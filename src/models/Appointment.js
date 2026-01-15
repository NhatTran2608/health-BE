/**
 * ===================================
 * MODEL: APPOINTMENT - LỊCH HẸN KHÁM
 * ===================================
 * Model này lưu trữ thông tin lịch hẹn khám bệnh
 */

const mongoose = require('mongoose');

// Định nghĩa Schema cho Appointment
const appointmentSchema = new mongoose.Schema({
    // Tham chiếu đến User - người đặt lịch
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Lịch hẹn phải thuộc về một người dùng']
    },

    // Tham chiếu đến Doctor - bác sĩ được đặt
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: [true, 'Vui lòng chọn bác sĩ']
    },

    // Ngày khám
    appointmentDate: {
        type: Date,
        required: [true, 'Vui lòng chọn ngày khám']
    },

    // Giờ khám (HH:MM)
    appointmentTime: {
        type: String,
        required: [true, 'Vui lòng chọn giờ khám'],
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Định dạng thời gian không hợp lệ (HH:MM)']
    },

    // Thông tin người đặt
    patientName: {
        type: String,
        required: [true, 'Vui lòng nhập họ tên'],
        trim: true,
        maxlength: [100, 'Họ tên không được quá 100 ký tự']
    },

    // Số điện thoại
    phoneNumber: {
        type: String,
        required: [true, 'Vui lòng nhập số điện thoại'],
        trim: true,
        match: [/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ']
    },

    // Mô tả triệu chứng/lý do khám
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Mô tả không được quá 500 ký tự']
    },

    // Trạng thái lịch hẹn
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'completed', 'cancelled'],
        default: 'pending'
    },

    // Ghi chú của admin (nếu có)
    adminNote: {
        type: String,
        maxlength: [500, 'Ghi chú không được quá 500 ký tự']
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
appointmentSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Index để tìm kiếm nhanh
appointmentSchema.index({ userId: 1, status: 1 });
appointmentSchema.index({ doctorId: 1, appointmentDate: 1 });
appointmentSchema.index({ status: 1, createdAt: -1 });

// Tạo và export Model
const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;

