/**
 * ===================================
 * MODEL: SLEEP TRACKER - THEO DÕI GIẤC NGỦ
 * ===================================
 * Model này lưu trữ lịch sử giấc ngủ của người dùng
 */

const mongoose = require('mongoose');

// Định nghĩa Schema cho SleepTracker
const sleepTrackerSchema = new mongoose.Schema({
    // Tham chiếu đến User
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Bản ghi phải thuộc về một người dùng']
    },

    // Ngày ngủ (ngày bắt đầu ngủ)
    sleepDate: {
        type: Date,
        required: [true, 'Vui lòng nhập ngày ngủ'],
        default: Date.now
    },

    // Giờ đi ngủ (HH:MM)
    bedtime: {
        type: String,
        required: [true, 'Vui lòng nhập giờ đi ngủ'],
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Định dạng thời gian không hợp lệ (HH:MM)']
    },

    // Giờ thức dậy (HH:MM)
    wakeTime: {
        type: String,
        required: [true, 'Vui lòng nhập giờ thức dậy'],
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Định dạng thời gian không hợp lệ (HH:MM)']
    },

    // Tổng thời gian ngủ (phút) - tự động tính
    totalSleepMinutes: {
        type: Number,
        min: [0, 'Thời gian ngủ không được âm']
    },

    // Chất lượng giấc ngủ
    quality: {
        type: String,
        enum: ['excellent', 'good', 'fair', 'poor'],
        default: 'good'
    },

    // Số lần thức giấc trong đêm
    wakeUpCount: {
        type: Number,
        default: 0,
        min: [0, 'Số lần thức giấc không được âm']
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

// Middleware: Tính tổng thời gian ngủ trước khi save
sleepTrackerSchema.pre('save', function (next) {
    if (this.bedtime && this.wakeTime) {
        const [bedHour, bedMin] = this.bedtime.split(':').map(Number);
        const [wakeHour, wakeMin] = this.wakeTime.split(':').map(Number);
        
        let bedMinutes = bedHour * 60 + bedMin;
        let wakeMinutes = wakeHour * 60 + wakeMin;
        
        // Xử lý trường hợp ngủ qua đêm (wakeTime < bedtime)
        if (wakeMinutes < bedMinutes) {
            wakeMinutes += 24 * 60; // Thêm 24 giờ
        }
        
        this.totalSleepMinutes = wakeMinutes - bedMinutes;
    }
    next();
});

// Index để tìm kiếm nhanh
sleepTrackerSchema.index({ userId: 1, sleepDate: -1 });

// Tạo và export Model
const SleepTracker = mongoose.model('SleepTracker', sleepTrackerSchema);

module.exports = SleepTracker;



