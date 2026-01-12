/**
 * ===================================
 * UTILITY: JWT HELPER
 * ===================================
 * Các hàm tiện ích liên quan đến JWT token
 */

const jwt = require('jsonwebtoken');

/**
 * Tạo JWT token cho user
 * @param {string} userId - ID của user
 * @returns {string} - JWT token
 */
const generateToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );
};

/**
 * Giải mã JWT token
 * @param {string} token - JWT token cần giải mã
 * @returns {object|null} - Payload đã giải mã hoặc null nếu lỗi
 */
const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return null;
    }
};

module.exports = {
    generateToken,
    verifyToken
};
