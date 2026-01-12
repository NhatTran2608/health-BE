/**
 * ===================================
 * MODEL: HEALTH RECORD - HỒ SƠ SỨC KHỎE
 * ===================================
 * Model này lưu trữ các bản ghi sức khỏe của người dùng
 * Mỗi lần đo/cập nhật sức khỏe sẽ tạo một bản ghi mới
 * Giúp theo dõi lịch sử thay đổi sức khỏe theo thời gian
 */

const mongoose = require('mongoose');

// Định nghĩa Schema cho HealthRecord
const healthRecordSchema = new mongoose.Schema({
    // Tham chiếu đến User - ai là chủ sở hữu bản ghi này
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Bản ghi phải thuộc về một người dùng']
    },

    // Chiều cao (cm)
    height: {
        type: Number,
        min: [0, 'Chiều cao không hợp lệ'],
        max: [300, 'Chiều cao không hợp lệ']
    },

    // Cân nặng (kg)
    weight: {
        type: Number,
        min: [0, 'Cân nặng không hợp lệ'],
        max: [500, 'Cân nặng không hợp lệ']
    },

    // Huyết áp (mmHg) - lưu dạng chuỗi "120/80"
    bloodPressure: {
        systolic: {  // Tâm thu
            type: Number,
            min: [0, 'Huyết áp không hợp lệ']
        },
        diastolic: { // Tâm trương
            type: Number,
            min: [0, 'Huyết áp không hợp lệ']
        }
    },

    // Nhịp tim (bpm - beats per minute)
    heartRate: {
        type: Number,
        min: [0, 'Nhịp tim không hợp lệ'],
        max: [300, 'Nhịp tim không hợp lệ']
    },

    // Đường huyết (mg/dL)
    bloodSugar: {
        type: Number,
        min: [0, 'Đường huyết không hợp lệ']
    },

    // Nhiệt độ cơ thể (°C)
    temperature: {
        type: Number,
        min: [30, 'Nhiệt độ không hợp lệ'],
        max: [45, 'Nhiệt độ không hợp lệ']
    },

    // Ghi chú thêm
    note: {
        type: String,
        maxlength: [500, 'Ghi chú không được quá 500 ký tự']
    },

    // Ngày ghi nhận
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index để tìm kiếm nhanh theo userId và thời gian
healthRecordSchema.index({ userId: 1, createdAt: -1 });

/**
 * Virtual: Tính BMI từ chiều cao và cân nặng
 * BMI = cân nặng (kg) / (chiều cao (m))^2
 */
healthRecordSchema.virtual('bmi').get(function () {
    if (this.height && this.weight) {
        const heightInMeters = this.height / 100;
        return (this.weight / (heightInMeters * heightInMeters)).toFixed(1);
    }
    return null;
});

// Đảm bảo virtuals được bao gồm khi chuyển sang JSON
healthRecordSchema.set('toJSON', { virtuals: true });
healthRecordSchema.set('toObject', { virtuals: true });

// Tạo và export Model
const HealthRecord = mongoose.model('HealthRecord', healthRecordSchema);

module.exports = HealthRecord;
