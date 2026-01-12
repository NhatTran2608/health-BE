/**
 * ===================================
 * ROUTES: AUTH - ĐỊNH NGHĨA API XÁC THỰC
 * ===================================
 * File này định nghĩa các endpoint cho xác thực người dùng
 */

const express = require('express');
const router = express.Router();

// Import controller
const { authController } = require('../controllers');

// Import middlewares
const { protect, registerValidation, loginValidation } = require('../middlewares');

/**
 * @route   POST /api/auth/register
 * @desc    Đăng ký tài khoản mới
 * @access  Public
 */
router.post('/register', registerValidation, authController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Đăng nhập
 * @access  Public
 */
router.post('/login', loginValidation, authController.login);

/**
 * @route   GET /api/auth/me
 * @desc    Lấy thông tin user đang đăng nhập
 * @access  Private
 */
router.get('/me', protect, authController.getMe);

/**
 * @route   POST /api/auth/logout
 * @desc    Đăng xuất
 * @access  Private
 */
router.post('/logout', protect, authController.logout);

module.exports = router;
