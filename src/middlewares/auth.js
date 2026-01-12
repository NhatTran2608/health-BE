/**
 * ===================================
 * MIDDLEWARE: AUTHENTICATION - XÁC THỰC JWT
 * ===================================
 * Middleware này kiểm tra và xác thực JWT token
 * Bảo vệ các route cần đăng nhập
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware xác thực người dùng
 * Kiểm tra token trong header Authorization
 */
const protect = async (req, res, next) => {
    let token;

    // Kiểm tra header Authorization có tồn tại và bắt đầu bằng 'Bearer'
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Lấy token từ header (bỏ phần 'Bearer ')
            token = req.headers.authorization.split(' ')[1];

            // Giải mã token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Tìm user từ id trong token, không lấy password
            req.user = await User.findById(decoded.id).select('-password');

            // Kiểm tra user có tồn tại không
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Người dùng không tồn tại'
                });
            }

            next();
        } catch (error) {
            console.error('Lỗi xác thực token:', error.message);
            return res.status(401).json({
                success: false,
                message: 'Token không hợp lệ hoặc đã hết hạn'
            });
        }
    }

    // Nếu không có token
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Không có quyền truy cập, vui lòng đăng nhập'
        });
    }
};

/**
 * Middleware kiểm tra role admin
 * Chỉ cho phép admin truy cập
 */
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({
            success: false,
            message: 'Chỉ admin mới có quyền truy cập'
        });
    }
};

module.exports = { protect, adminOnly };
