/**
 * ===================================
 * ROUTES: SEARCH - ĐỊNH NGHĨA API TÌM KIẾM
 * ===================================
 * File này định nghĩa các endpoint cho tìm kiếm
 */

const express = require('express');
const router = express.Router();

// Import controller
const { searchController } = require('../controllers');

// Import middlewares
const { protect } = require('../middlewares');

/**
 * @route   GET /api/search
 * @desc    Tìm kiếm tổng hợp
 * @access  Private
 * @query   keyword - Từ khóa tìm kiếm
 * @query   type - Loại tìm kiếm (all, chat, health)
 * @query   page - Trang hiện tại
 * @query   limit - Số kết quả mỗi trang
 */
router.get('/', protect, searchController.search);

/**
 * @route   GET /api/search/chats
 * @desc    Tìm kiếm lịch sử chat
 * @access  Private
 * @query   keyword - Từ khóa tìm kiếm
 */
router.get('/chats', protect, searchController.searchChats);

module.exports = router;
