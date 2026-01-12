/**
 * ===================================
 * ROUTES: USER - ĐỊNH NGHĨA API NGƯỜI DÙNG
 * ===================================
 * File này định nghĩa các endpoint cho quản lý người dùng
 */

const express = require('express');
const router = express.Router();

// Import controller
const { userController } = require('../controllers');

// Import middlewares
const { protect, adminOnly, updateProfileValidation } = require('../middlewares');

/**
 * @route   PUT /api/users/profile
 * @desc    Cập nhật thông tin profile
 * @access  Private
 */
router.put('/profile', protect, updateProfileValidation, userController.updateProfile);

/**
 * @route   PUT /api/users/change-password
 * @desc    Thay đổi mật khẩu
 * @access  Private
 */
router.put('/change-password', protect, userController.changePassword);

/**
 * @route   GET /api/users
 * @desc    Lấy danh sách tất cả users (Admin)
 * @access  Private/Admin
 */
router.get('/', protect, adminOnly, userController.getAllUsers);

/**
 * @route   DELETE /api/users/:id
 * @desc    Xóa user (Admin)
 * @access  Private/Admin
 */
router.delete('/:id', protect, adminOnly, userController.deleteUser);

module.exports = router;
