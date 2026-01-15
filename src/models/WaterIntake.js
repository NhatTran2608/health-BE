/**
 * ===================================
 * MODEL: WATER INTAKE - THEO DÕI LƯỢNG NƯỚC UỐNG
 * ===================================
 * Model này lưu trữ lịch sử uống nước hàng ngày của người dùng
 */

const mongoose = require('mongoose');

// Định nghĩa Schema cho WaterIntake
const waterIntakeSchema = new mongoose.Schema({
    // Tham chiếu đến User
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Bản ghi phải thuộc về một người dùng']
    },

    // Ngày ghi nhận
    date: {
        type: Date,
        required: [true, 'Vui lòng nhập ngày'],
        default: Date.now
    },

    // Lượng nước uống (ml)
    amount: {
        type: Number,
        required: [true, 'Vui lòng nhập lượng nước uống'],
        min: [0, 'Lượng nước không được âm']
    },

    // Ghi chú (tùy chọn)
    note: {
        type: String,
        maxlength: [200, 'Ghi chú không được quá 200 ký tự']
    },

    // Ngày tạo
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index để tìm kiếm nhanh theo user và ngày
waterIntakeSchema.index({ userId: 1, date: -1 });
waterIntakeSchema.index({ userId: 1, date: 1 });

// Tạo và export Model
const WaterIntake = mongoose.model('WaterIntake', waterIntakeSchema);

module.exports = WaterIntake;



