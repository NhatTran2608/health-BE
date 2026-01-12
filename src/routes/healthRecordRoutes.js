/**
 * ===================================
 * ROUTES: HEALTH RECORD - ĐỊNH NGHĨA API HỒ SƠ SỨC KHỎE
 * ===================================
 * File này định nghĩa các endpoint cho quản lý hồ sơ sức khỏe
 */

const express = require('express');
const router = express.Router();

// Import controller
const { healthRecordController } = require('../controllers');

// Import middlewares
const { protect, healthRecordValidation } = require('../middlewares');

/**
 * @route   GET /api/health-records/latest
 * @desc    Lấy bản ghi sức khỏe mới nhất
 * @access  Private
 * @note    Đặt route cụ thể trước route có parameter (:id)
 */
router.get('/latest', protect, healthRecordController.getLatestRecord);

/**
 * @route   POST /api/health-records
 * @desc    Tạo bản ghi sức khỏe mới
 * @access  Private
 */
router.post('/', protect, healthRecordValidation, healthRecordController.createRecord);

/**
 * @route   GET /api/health-records
 * @desc    Lấy danh sách bản ghi sức khỏe
 * @access  Private
 */
router.get('/', protect, healthRecordController.getRecords);

/**
 * @route   GET /api/health-records/:id
 * @desc    Lấy một bản ghi sức khỏe theo ID
 * @access  Private
 */
router.get('/:id', protect, healthRecordController.getRecordById);

/**
 * @route   PUT /api/health-records/:id
 * @desc    Cập nhật bản ghi sức khỏe
 * @access  Private
 */
router.put('/:id', protect, healthRecordValidation, healthRecordController.updateRecord);

/**
 * @route   DELETE /api/health-records/:id
 * @desc    Xóa bản ghi sức khỏe
 * @access  Private
 */
router.delete('/:id', protect, healthRecordController.deleteRecord);

module.exports = router;
