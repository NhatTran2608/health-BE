/**
 * ===================================
 * MODEL: CHAT HISTORY - LỊCH SỬ TƯ VẤN
 * ===================================
 * Model này lưu trữ lịch sử các cuộc hội thoại
 * giữa người dùng và chatbot tư vấn sức khỏe
 */

const mongoose = require('mongoose');

// Định nghĩa Schema cho ChatHistory
const chatHistorySchema = new mongoose.Schema({
    // Tham chiếu đến User - người hỏi
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Cuộc hội thoại phải thuộc về một người dùng']
    },

    // Câu hỏi của người dùng
    question: {
        type: String,
        required: [true, 'Vui lòng nhập câu hỏi'],
        maxlength: [1000, 'Câu hỏi không được quá 1000 ký tự']
    },

    // Câu trả lời từ chatbot
    answer: {
        type: String,
        required: [true, 'Câu trả lời không được để trống'],
        maxlength: [2000, 'Câu trả lời không được quá 2000 ký tự']
    },

    // Danh mục câu hỏi (để phân loại)
    category: {
        type: String,
        enum: ['general', 'stress', 'sleep', 'nutrition', 'exercise', 'disease', 'other'],
        default: 'general'
    },

    // Từ khóa được phát hiện trong câu hỏi
    detectedKeywords: [{
        type: String
    }],

    // Đánh giá phản hồi (người dùng có thể đánh giá)
    rating: {
        type: Number,
        min: 1,
        max: 5
    },

    // Thời gian hỏi
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index để tìm kiếm nhanh
chatHistorySchema.index({ userId: 1, createdAt: -1 });
chatHistorySchema.index({ question: 'text' }); // Text index để tìm kiếm full-text

// Tạo và export Model
const ChatHistory = mongoose.model('ChatHistory', chatHistorySchema);

module.exports = ChatHistory;
