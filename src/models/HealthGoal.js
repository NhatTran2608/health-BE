/**
 * ===================================
 * MODEL: HEALTH GOAL - MỤC TIÊU SỨC KHỎE
 * ===================================
 * Model này lưu trữ các mục tiêu sức khỏe của người dùng
 * Ví dụ: giảm cân, tăng cân, tập thể dục, uống nước...
 */

const mongoose = require('mongoose');

// Định nghĩa Schema cho HealthGoal
const healthGoalSchema = new mongoose.Schema({
    // Tham chiếu đến User
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Mục tiêu phải thuộc về một người dùng']
    },

    // Tiêu đề mục tiêu
    title: {
        type: String,
        required: [true, 'Vui lòng nhập tiêu đề mục tiêu'],
        maxlength: [100, 'Tiêu đề không được quá 100 ký tự']
    },

    // Mô tả chi tiết
    description: {
        type: String,
        maxlength: [500, 'Mô tả không được quá 500 ký tự']
    },

    // Loại mục tiêu
    type: {
        type: String,
        enum: ['weight_loss', 'weight_gain', 'exercise', 'water_intake', 'sleep', 'nutrition', 'other'],
        required: [true, 'Vui lòng chọn loại mục tiêu']
    },

    // Giá trị mục tiêu (ví dụ: giảm 5kg, uống 2L nước)
    targetValue: {
        type: Number,
        required: [true, 'Vui lòng nhập giá trị mục tiêu']
    },

    // Đơn vị (kg, L, giờ, phút, lần...)
    unit: {
        type: String,
        required: [true, 'Vui lòng nhập đơn vị'],
        maxlength: [20, 'Đơn vị không được quá 20 ký tự']
    },

    // Giá trị hiện tại
    currentValue: {
        type: Number,
        default: 0
    },

    // Ngày bắt đầu
    startDate: {
        type: Date,
        default: Date.now
    },

    // Ngày kết thúc (deadline)
    endDate: {
        type: Date,
        required: [true, 'Vui lòng nhập ngày kết thúc mục tiêu']
    },

    // Trạng thái
    status: {
        type: String,
        enum: ['active', 'completed', 'paused', 'cancelled'],
        default: 'active'
    },

    // Tiến độ (%)
    progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
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

// Cập nhật updatedAt và progress trước khi save
healthGoalSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    
    // Tính toán tiến độ
    if (this.targetValue > 0) {
        this.progress = Math.min(100, Math.max(0, (this.currentValue / this.targetValue) * 100));
    }
    
    // Tự động cập nhật status nếu đạt mục tiêu
    if (this.progress >= 100 && this.status === 'active') {
        this.status = 'completed';
    }
    
    next();
});

// Index để tìm kiếm nhanh
healthGoalSchema.index({ userId: 1, status: 1 });
healthGoalSchema.index({ userId: 1, type: 1 });

// Tạo và export Model
const HealthGoal = mongoose.model('HealthGoal', healthGoalSchema);

module.exports = HealthGoal;



