/**
 * ===================================
 * CẤU HÌNH KẾT NỐI DATABASE - MONGODB
 * ===================================
 * File này chứa cấu hình kết nối đến MongoDB
 * Sử dụng mongoose để tương tác với database
 */

const mongoose = require('mongoose');

/**
 * Hàm kết nối đến MongoDB
 * @returns {Promise} - Promise kết nối database
 */
const connectDB = async () => {
    try {
        // Lấy connection string từ biến môi trường
        const conn = await mongoose.connect(process.env.MONGODB_URI);

        console.log(`✅ MongoDB đã kết nối: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Lỗi kết nối MongoDB: ${error.message}`);
        // Thoát process nếu không kết nối được database
        process.exit(1);
    }
};

module.exports = connectDB;
