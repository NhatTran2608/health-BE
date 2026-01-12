/**
 * ===================================
 * CONTROLLER: REPORT - BÁO CÁO & THỐNG KÊ
 * ===================================
 * Controller này nhận request và trả response cho các API báo cáo
 */

const reportService = require('../services/reportService');
const { successResponse } = require('../utils/responseHelper');

/**
 * @desc    Lấy báo cáo sức khỏe (dữ liệu cho biểu đồ)
 * @route   GET /api/reports/health
 * @access  Private
 * 
 * @example Query: ?startDate=2024-01-01&endDate=2024-12-31
 * 
 * @example Response:
 * {
 *   "success": true,
 *   "message": "Thành công",
 *   "data": {
 *     "chartData": {
 *       "weight": [
 *         { "date": "2024-01-15", "value": 65 },
 *         { "date": "2024-01-22", "value": 64.5 }
 *       ],
 *       "bmi": [...],
 *       "bloodPressure": [...],
 *       "heartRate": [...]
 *     },
 *     "stats": {
 *       "totalRecords": 10,
 *       "weight": { "min": 64, "max": 66, "avg": 65, "latest": 64.5 }
 *     }
 *   }
 * }
 */
const getHealthReport = async (req, res, next) => {
    try {
        const report = await reportService.getHealthReport(req.user._id, req.query);
        return successResponse(res, 200, 'Thành công', report);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Lấy báo cáo lịch sử chatbot
 * @route   GET /api/reports/chatbot
 * @access  Private
 * 
 * @example Query: ?startDate=2024-01-01&endDate=2024-12-31
 * 
 * @example Response:
 * {
 *   "success": true,
 *   "message": "Thành công",
 *   "data": {
 *     "summary": {
 *       "totalQuestions": 50,
 *       "dateRange": { "start": "...", "end": "..." }
 *     },
 *     "categoryStats": [
 *       { "category": "stress", "count": 15 },
 *       { "category": "sleep", "count": 12 }
 *     ],
 *     "dailyStats": [
 *       { "date": "2024-01-15", "count": 5 }
 *     ],
 *     "topKeywords": [
 *       { "keyword": "stress", "count": 10 }
 *     ]
 *   }
 * }
 */
const getChatbotReport = async (req, res, next) => {
    try {
        const report = await reportService.getChatbotReport(req.user._id, req.query);
        return successResponse(res, 200, 'Thành công', report);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Lấy báo cáo tổng quan (dashboard)
 * @route   GET /api/reports/dashboard
 * @access  Private
 * 
 * @example Response:
 * {
 *   "success": true,
 *   "message": "Thành công",
 *   "data": {
 *     "healthSummary": {
 *       "latestRecord": { ... },
 *       "totalRecords": 10
 *     },
 *     "chatSummary": {
 *       "totalQuestions": 50,
 *       "recentChats": [...]
 *     }
 *   }
 * }
 */
const getDashboardReport = async (req, res, next) => {
    try {
        const report = await reportService.getDashboardReport(req.user._id);
        return successResponse(res, 200, 'Thành công', report);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getHealthReport,
    getChatbotReport,
    getDashboardReport
};
