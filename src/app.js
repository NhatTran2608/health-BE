/**
 * ===================================
 * APP.JS - CẤU HÌNH EXPRESS APPLICATION
 * ===================================
 * File này cấu hình Express app với các middleware cần thiết
 * Đây là nơi tập trung cấu hình ứng dụng
 */

const express = require('express');
const cors = require('cors');

// Import routes
const routes = require('./routes');

// Import error handlers
const { errorHandler, notFound } = require('./middlewares');

// Khởi tạo Express app
const app = express();

// ===================================
// CẤU HÌNH MIDDLEWARE
// ===================================

// Cho phép CORS - Cross Origin Resource Sharing
// Cho phép frontend từ domain khác gọi API
app.use(cors({
    origin: '*', // Cho phép tất cả origins (trong production nên giới hạn)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON body
// Cho phép nhận dữ liệu JSON từ request body
app.use(express.json({ limit: '10mb' }));

// Parse URL-encoded body
// Cho phép nhận dữ liệu từ form
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ===================================
// ĐĂNG KÝ ROUTES
// ===================================

// Route health check - Kiểm tra server còn sống không
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server đang hoạt động bình thường',
        timestamp: new Date().toISOString()
    });
});

// Đăng ký tất cả API routes với prefix /api
app.use('/api', routes);

// ===================================
// XỬ LÝ LỖI
// ===================================

// Middleware xử lý route không tồn tại (404)
app.use(notFound);

// Middleware xử lý lỗi toàn cục
app.use(errorHandler);

module.exports = app;
