/**
 * ===================================
 * ROUTES: REMINDER - ĐỊNH NGHĨA API NHẮC NHỞ
 * ===================================
 * File này định nghĩa các endpoint cho quản lý nhắc nhở
 */

const express = require('express');
const router = express.Router();

// Import controller
const { reminderController } = require('../controllers');

// Import middlewares
const { protect, reminderValidation } = require('../middlewares');

/**
 * @route   POST /api/reminders
 * @desc    Tạo nhắc nhở mới
 * @access  Private
 */
router.post('/', protect, reminderValidation, reminderController.createReminder);

/**
 * @route   GET /api/reminders
 * @desc    Lấy danh sách nhắc nhở
 * @access  Private
 */
router.get('/', protect, reminderController.getReminders);

/**
 * @route   GET /api/reminders/:id
 * @desc    Lấy một nhắc nhở theo ID
 * @access  Private
 */
router.get('/:id', protect, reminderController.getReminderById);

/**
 * @route   PUT /api/reminders/:id
 * @desc    Cập nhật nhắc nhở
 * @access  Private
 */
router.put('/:id', protect, reminderValidation, reminderController.updateReminder);

/**
 * @route   PUT /api/reminders/:id/toggle
 * @desc    Bật/tắt nhắc nhở
 * @access  Private
 */
router.put('/:id/toggle', protect, reminderController.toggleReminder);

/**
 * @route   DELETE /api/reminders/:id
 * @desc    Xóa nhắc nhở
 * @access  Private
 */
router.delete('/:id', protect, reminderController.deleteReminder);

module.exports = router;
