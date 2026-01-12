/**
 * ===================================
 * SERVICE: SEARCH - TÌM KIẾM
 * ===================================
 * Service này xử lý logic tìm kiếm:
 * - Tìm kiếm lịch sử tư vấn
 * - Tìm kiếm bản ghi sức khỏe
 */

const ChatHistory = require('../models/ChatHistory');
const HealthRecord = require('../models/HealthRecord');

/**
 * Tìm kiếm tổng hợp
 * @param {string} userId - ID của user
 * @param {string} keyword - Từ khóa tìm kiếm
 * @param {object} query - Query parameters (page, limit, type)
 * @returns {object} - Kết quả tìm kiếm
 */
const search = async (userId, keyword, query) => {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 20;
    const skip = (page - 1) * limit;
    const type = query.type || 'all'; // 'all', 'chat', 'health'

    let results = {
        chats: [],
        healthRecords: []
    };
    let total = 0;

    // Tìm trong lịch sử chat
    if (type === 'all' || type === 'chat') {
        const chatResults = await ChatHistory.find({
            userId,
            $or: [
                { question: { $regex: keyword, $options: 'i' } },
                { answer: { $regex: keyword, $options: 'i' } }
            ]
        })
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const chatTotal = await ChatHistory.countDocuments({
            userId,
            $or: [
                { question: { $regex: keyword, $options: 'i' } },
                { answer: { $regex: keyword, $options: 'i' } }
            ]
        });

        results.chats = chatResults;
        total += chatTotal;
    }

    // Tìm trong bản ghi sức khỏe (tìm theo note)
    if (type === 'all' || type === 'health') {
        const healthResults = await HealthRecord.find({
            userId,
            note: { $regex: keyword, $options: 'i' }
        })
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const healthTotal = await HealthRecord.countDocuments({
            userId,
            note: { $regex: keyword, $options: 'i' }
        });

        results.healthRecords = healthResults;
        total += healthTotal;
    }

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
 * Tìm kiếm lịch sử chat
 * @param {string} userId - ID của user
 * @param {string} keyword - Từ khóa
 * @param {object} query - Query parameters
 * @returns {object} - Kết quả tìm kiếm
 */
const searchChats = async (userId, keyword, query) => {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {
        userId,
        $or: [
            { question: { $regex: keyword, $options: 'i' } },
            { answer: { $regex: keyword, $options: 'i' } },
            { detectedKeywords: { $in: [new RegExp(keyword, 'i')] } }
        ]
    };

    const results = await ChatHistory.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

    const total = await ChatHistory.countDocuments(filter);

    return {
        results,
        pagination: {
            page,
            limit,
            total
        }
    };
};

module.exports = {
    search,
    searchChats
};
