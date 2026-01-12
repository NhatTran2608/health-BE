/**
 * ===================================
 * CONTROLLER: CHATBOT - TƯ VẤN SỨC KHỎE
 * ===================================
 * Controller này nhận request và trả response cho các API chatbot
 */

const chatbotService = require('../services/chatbotService');
const { successResponse, paginatedResponse } = require('../utils/responseHelper');

/**
 * @desc    Gửi câu hỏi cho chatbot
 * @route   POST /api/chatbot/ask
 * @access  Private
 * 
 * @example Request body:
 * {
 *   "question": "Tôi bị stress phải làm sao?"
 * }
 * 
 * @example Response:
 * {
 *   "success": true,
 *   "message": "Thành công",
 *   "data": {
 *     "_id": "...",
 *     "question": "Tôi bị stress phải làm sao?",
 *     "answer": "Căng thẳng kéo dài có thể ảnh hưởng đến sức khỏe...",
 *     "category": "stress",
 *     "detectedKeywords": ["stress"],
 *     "createdAt": "2024-01-15T10:30:00.000Z"
 *   }
 * }
 */
const ask = async (req, res, next) => {
    try {
        const { question } = req.body;
        const result = await chatbotService.ask(req.user._id, question);
        return successResponse(res, 200, 'Thành công', result);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Lấy lịch sử hội thoại
 * @route   GET /api/chatbot/history
 * @access  Private
 * 
 * @example Query: ?page=1&limit=20
 * 
 * @example Response:
 * {
 *   "success": true,
 *   "data": [
 *     {
 *       "_id": "...",
 *       "question": "...",
 *       "answer": "...",
 *       "category": "stress",
 *       "createdAt": "..."
 *     },
 *     ...
 *   ],
 *   "pagination": { ... }
 * }
 */
const getHistory = async (req, res, next) => {
    try {
        const { history, pagination } = await chatbotService.getHistory(
            req.user._id,
            req.query
        );
        return paginatedResponse(res, history, pagination);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Đánh giá câu trả lời
 * @route   PUT /api/chatbot/:id/rate
 * @access  Private
 * 
 * @example Request body:
 * {
 *   "rating": 5
 * }
 */
const rateResponse = async (req, res, next) => {
    try {
        const { rating } = req.body;
        const result = await chatbotService.rateResponse(
            req.params.id,
            req.user._id,
            rating
        );
        return successResponse(res, 200, 'Đánh giá thành công', result);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Xóa một cuộc hội thoại
 * @route   DELETE /api/chatbot/:id
 * @access  Private
 */
const deleteChat = async (req, res, next) => {
    try {
        await chatbotService.deleteChat(req.params.id, req.user._id);
        return successResponse(res, 200, 'Xóa cuộc hội thoại thành công');
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Xóa toàn bộ lịch sử chat
 * @route   DELETE /api/chatbot/history/clear
 * @access  Private
 */
const clearHistory = async (req, res, next) => {
    try {
        const deletedCount = await chatbotService.clearHistory(req.user._id);
        return successResponse(res, 200, `Đã xóa ${deletedCount} cuộc hội thoại`);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    ask,
    getHistory,
    rateResponse,
    deleteChat,
    clearHistory
};
