/**
 * ===================================
 * ROUTES: REPORT - ĐỊNH NGHĨA API BÁO CÁO
 * ===================================
 * File này định nghĩa các endpoint cho báo cáo và thống kê
 */

const express = require('express');
const router = express.Router();

// Import controller
const { reportController } = require('../controllers');

// Import middlewares
const { protect, adminOnly } = require('../middlewares');

/**
 * @route   GET /api/reports/health
 * @desc    Lấy báo cáo sức khỏe (dữ liệu cho biểu đồ)
 * @access  Private
 */
router.get('/health', protect, reportController.getHealthReport);

/**
 * @route   GET /api/reports/chatbot
 * @desc    Lấy báo cáo lịch sử chatbot
 * @access  Private
 */
router.get('/chatbot', protect, reportController.getChatbotReport);

/**
 * @route   GET /api/reports/dashboard
 * @desc    Lấy báo cáo tổng quan (dashboard)
 * @access  Private
 */
router.get('/dashboard', protect, reportController.getDashboardReport);

/**
 * @route   GET /api/reports/admin/stats
 * @desc    Lấy thống kê tổng thể cho admin
 * @access  Private/Admin
 */
router.get('/admin/stats', protect, adminOnly, reportController.getAdminStats);

module.exports = router;
