/**
 * ===================================
 * SERVICE: CHATBOT - TƯ VẤN SỨC KHỎE
 * ===================================
 * Service này xử lý logic nghiệp vụ liên quan đến chatbot:
 * - Trả lời câu hỏi sức khỏe
 * - Lưu lịch sử hội thoại
 * - Tìm kiếm lịch sử
 */

const ChatHistory = require('../models/ChatHistory');
const HealthRecord = require('../models/HealthRecord');
const User = require('../models/User');
const { getGeminiResponse } = require('./geminiService');

/**
 * Xử lý câu hỏi và trả về câu trả lời
 * @param {string} userId - ID của user
 * @param {string} question - Câu hỏi của user
 * @returns {object} - Câu trả lời và thông tin liên quan
 */
const ask = async (userId, question) => {
    // Lấy lịch sử hội thoại gần đây để cung cấp context cho Gemini
    const recentHistory = await ChatHistory.find({ userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('question answer')
        .lean();

    // Đảo ngược để có thứ tự từ cũ đến mới
    const chatHistory = recentHistory.reverse();

    // Lấy thông tin user và dữ liệu sức khỏe mới nhất
    const user = await User.findById(userId).select('name age gender height weight medicalHistory lifestyle').lean();
    const latestHealthRecord = await HealthRecord.findOne({ userId })
        .sort({ createdAt: -1 })
        .lean();

    // Tính BMI nếu có dữ liệu
    let bmi = null;
    const height = latestHealthRecord?.height || user?.height;
    const weight = latestHealthRecord?.weight || user?.weight;
    if (height && weight) {
        const heightInMeters = height / 100;
        bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
    }

    // Tạo object chứa dữ liệu sức khỏe của user
    const userHealthData = {
        name: user?.name,
        age: user?.age,
        gender: user?.gender === 'male' ? 'Nam' : user?.gender === 'female' ? 'Nữ' : 'Khác',
        height: height,
        weight: weight,
        bmi: bmi,
        medicalHistory: user?.medicalHistory,
        lifestyle: user?.lifestyle,
        bloodPressure: latestHealthRecord?.bloodPressure,
        heartRate: latestHealthRecord?.heartRate,
        bloodSugar: latestHealthRecord?.bloodSugar,
        temperature: latestHealthRecord?.temperature,
        lastRecordDate: latestHealthRecord?.createdAt
    };

    // Lấy câu trả lời từ Gemini AI
    const { answer, category, detectedKeywords } = await getGeminiResponse(question, chatHistory, userHealthData);

    // Lưu vào lịch sử
    const chatRecord = await ChatHistory.create({
        userId,
        question,
        answer,
        category,
        detectedKeywords
    });

    return {
        _id: chatRecord._id,
        question,
        answer,
        category,
        detectedKeywords,
        createdAt: chatRecord.createdAt
    };
};

/**
 * Lấy lịch sử hội thoại của user
 * @param {string} userId - ID của user
 * @param {object} query - Query parameters (page, limit)
 * @returns {object} - Danh sách hội thoại và phân trang
 */
const getHistory = async (userId, query) => {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 20;
    const skip = (page - 1) * limit;

    const history = await ChatHistory.find({ userId })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

    const total = await ChatHistory.countDocuments({ userId });

    return {
        history,
        pagination: {
            page,
            limit,
            total
        }
    };
};

/**
 * Tìm kiếm trong lịch sử hội thoại
 * @param {string} userId - ID của user
 * @param {string} keyword - Từ khóa tìm kiếm
 * @param {object} query - Query parameters (page, limit)
 * @returns {object} - Kết quả tìm kiếm
 */
const searchHistory = async (userId, keyword, query) => {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 20;
    const skip = (page - 1) * limit;

    // Tìm kiếm theo text index hoặc regex
    const searchQuery = {
        userId,
        $or: [
            { question: { $regex: keyword, $options: 'i' } },
            { answer: { $regex: keyword, $options: 'i' } }
        ]
    };

    const results = await ChatHistory.find(searchQuery)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

    const total = await ChatHistory.countDocuments(searchQuery);

    return {
        results,
        pagination: {
            page,
            limit,
            total
        }
    };
};

/**
 * Đánh giá câu trả lời
 * @param {string} chatId - ID của cuộc hội thoại
 * @param {string} userId - ID của user
 * @param {number} rating - Điểm đánh giá (1-5)
 * @returns {object} - Bản ghi đã cập nhật
 */
const rateResponse = async (chatId, userId, rating) => {
    const chat = await ChatHistory.findOneAndUpdate(
        { _id: chatId, userId },
        { rating },
        { new: true }
    );

    if (!chat) {
        const error = new Error('Không tìm thấy cuộc hội thoại');
        error.statusCode = 404;
        throw error;
    }

    return chat;
};

/**
 * Xóa một cuộc hội thoại
 * @param {string} chatId - ID của cuộc hội thoại
 * @param {string} userId - ID của user
 * @returns {boolean} - Thành công hay không
 */
const deleteChat = async (chatId, userId) => {
    const chat = await ChatHistory.findOneAndDelete({
        _id: chatId,
        userId
    });

    if (!chat) {
        const error = new Error('Không tìm thấy cuộc hội thoại');
        error.statusCode = 404;
        throw error;
    }

    return true;
};

/**
 * Xóa toàn bộ lịch sử của user
 * @param {string} userId - ID của user
 * @returns {number} - Số bản ghi đã xóa
 */
const clearHistory = async (userId) => {
    const result = await ChatHistory.deleteMany({ userId });
    return result.deletedCount;
};

module.exports = {
    ask,
    getHistory,
    searchHistory,
    rateResponse,
    deleteChat,
    clearHistory
};
