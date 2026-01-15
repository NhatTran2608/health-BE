/**
 * ===================================
 * MODEL: EXERCISE LOG - NHẬT KÝ TẬP LUYỆN
 * ===================================
 * Model này lưu trữ lịch sử tập luyện của người dùng
 */

const mongoose = require('mongoose');

// Định nghĩa Schema cho ExerciseLog
const exerciseLogSchema = new mongoose.Schema({
    // Tham chiếu đến User
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Bản ghi phải thuộc về một người dùng']
    },

    // Loại bài tập
    exerciseType: {
        type: String,
        required: [true, 'Vui lòng chọn loại bài tập'],
        enum: ['running', 'walking', 'cycling', 'swimming', 'gym', 'yoga', 'dancing', 'sports', 'other']
    },

    // Tên bài tập (tùy chỉnh)
    exerciseName: {
        type: String,
        required: [true, 'Vui lòng nhập tên bài tập'],
        maxlength: [100, 'Tên bài tập không được quá 100 ký tự']
    },

    // Thời gian tập (phút)
    duration: {
        type: Number,
        required: [true, 'Vui lòng nhập thời gian tập'],
        min: [0, 'Thời gian không được âm']
    },

    // Cường độ
    intensity: {
        type: String,
        enum: ['low', 'moderate', 'high'],
        default: 'moderate'
    },

    // Calo đốt cháy (ước tính)
    caloriesBurned: {
        type: Number,
        min: [0, 'Calo không được âm']
    },

    // Khoảng cách (km) - cho các bài tập như chạy, đi bộ, đạp xe
    distance: {
        type: Number,
        min: [0, 'Khoảng cách không được âm']
    },

    // Ngày tập
    exerciseDate: {
        type: Date,
        required: [true, 'Vui lòng nhập ngày tập'],
        default: Date.now
    },

    // Ghi chú
    note: {
        type: String,
        maxlength: [500, 'Ghi chú không được quá 500 ký tự']
    },

    // Ngày tạo
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index để tìm kiếm nhanh
exerciseLogSchema.index({ userId: 1, exerciseDate: -1 });
exerciseLogSchema.index({ userId: 1, exerciseType: 1 });

// Tạo và export Model
const ExerciseLog = mongoose.model('ExerciseLog', exerciseLogSchema);

module.exports = ExerciseLog;



