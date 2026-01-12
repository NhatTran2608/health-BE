/**
 * ===================================
 * ROUTES: CHATBOT - ĐỊNH NGHĨA API CHATBOT
 * ===================================
 * File này định nghĩa các endpoint cho chatbot tư vấn sức khỏe
 */

const express = require('express');
const router = express.Router();

// Import controller
const { chatbotController } = require('../controllers');

// Import middlewares
const { protect, chatbotValidation } = require('../middlewares');

/**
 * @route   POST /api/chatbot/ask
 * @desc    Gửi câu hỏi cho chatbot
 * @access  Private
 */
router.post('/ask', protect, chatbotValidation, chatbotController.ask);

/**
 * @route   GET /api/chatbot/history
 * @desc    Lấy lịch sử hội thoại
 * @access  Private
 */
router.get('/history', protect, chatbotController.getHistory);

/**
 * @route   DELETE /api/chatbot/history/clear
 * @desc    Xóa toàn bộ lịch sử chat
 * @access  Private
 * @note    Đặt route cụ thể trước route có parameter (:id)
 */
router.delete('/history/clear', protect, chatbotController.clearHistory);

/**
 * @route   PUT /api/chatbot/:id/rate
 * @desc    Đánh giá câu trả lời
 * @access  Private
 */
router.put('/:id/rate', protect, chatbotController.rateResponse);

/**
 * @route   DELETE /api/chatbot/:id
 * @desc    Xóa một cuộc hội thoại
 * @access  Private
 */
router.delete('/:id', protect, chatbotController.deleteChat);

module.exports = router;
