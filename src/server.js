/**
 * ===================================
 * SERVER.JS - KHỞI ĐỘNG SERVER
 * ===================================
 * File này là entry point của ứng dụng
 * Kết nối database và khởi động Express server
 */

// Load biến môi trường từ file .env
require('dotenv').config();

// Import dependencies
const app = require('./app');
const connectDB = require('./config/db');

// Lấy PORT từ biến môi trường hoặc dùng mặc định 5000
const PORT = process.env.PORT || 5000;

/**
 * Hàm khởi động server
 * 1. Kết nối MongoDB
 * 2. Khởi động Express server
 */
const startServer = async () => {
    try {
        // Kết nối đến MongoDB
        await connectDB();

        // Khởi động Express server
        app.listen(PORT, () => {
            console.log('====================================');
            console.log('🏥 HEALTH MANAGEMENT SYSTEM API');
            console.log('====================================');
            console.log(`✅ Server đang chạy ở port: ${PORT}`);
            console.log(`📍 URL: http://localhost:${PORT}`);
            console.log(`📍 API: http://localhost:${PORT}/api`);
            console.log(`🌍 Môi trường: ${process.env.NODE_ENV || 'development'}`);
            console.log('====================================');
            console.log('📋 DANH SÁCH API ENDPOINTS:');
            console.log('------------------------------------');
            console.log('AUTH:');
            console.log('  POST   /api/auth/register    - Đăng ký');
            console.log('  POST   /api/auth/login       - Đăng nhập');
            console.log('  GET    /api/auth/me          - Thông tin user');
            console.log('  POST   /api/auth/logout      - Đăng xuất');
            console.log('------------------------------------');
            console.log('USER:');
            console.log('  PUT    /api/users/profile    - Cập nhật profile');
            console.log('  PUT    /api/users/change-password - Đổi mật khẩu');
            console.log('------------------------------------');
            console.log('HEALTH RECORDS:');
            console.log('  POST   /api/health-records   - Tạo bản ghi');
            console.log('  GET    /api/health-records   - Danh sách bản ghi');
            console.log('  GET    /api/health-records/latest - Bản ghi mới nhất');
            console.log('  GET    /api/health-records/:id - Chi tiết bản ghi');
            console.log('  PUT    /api/health-records/:id - Cập nhật bản ghi');
            console.log('  DELETE /api/health-records/:id - Xóa bản ghi');
            console.log('------------------------------------');
            console.log('CHATBOT:');
            console.log('  POST   /api/chatbot/ask      - Hỏi chatbot');
            console.log('  GET    /api/chatbot/history  - Lịch sử chat');
            console.log('  PUT    /api/chatbot/:id/rate - Đánh giá câu trả lời');
            console.log('  DELETE /api/chatbot/:id      - Xóa chat');
            console.log('------------------------------------');
            console.log('REMINDERS:');
            console.log('  POST   /api/reminders        - Tạo nhắc nhở');
            console.log('  GET    /api/reminders        - Danh sách nhắc nhở');
            console.log('  PUT    /api/reminders/:id    - Cập nhật nhắc nhở');
            console.log('  PUT    /api/reminders/:id/toggle - Bật/tắt');
            console.log('  DELETE /api/reminders/:id    - Xóa nhắc nhở');
            console.log('------------------------------------');
            console.log('REPORTS:');
            console.log('  GET    /api/reports/health   - Báo cáo sức khỏe');
            console.log('  GET    /api/reports/chatbot  - Báo cáo chatbot');
            console.log('  GET    /api/reports/dashboard - Tổng quan');
            console.log('------------------------------------');
            console.log('SEARCH:');
            console.log('  GET    /api/search?keyword=  - Tìm kiếm');
            console.log('====================================');
        });
    } catch (error) {
        console.error('❌ Không thể khởi động server:', error.message);
        process.exit(1);
    }
};

// Xử lý lỗi Unhandled Promise Rejection
process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled Promise Rejection:', err.message);
    // Đóng server gracefully
    process.exit(1);
});

// Xử lý lỗi Uncaught Exception
process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err.message);
    process.exit(1);
});

// Khởi động server
startServer();
