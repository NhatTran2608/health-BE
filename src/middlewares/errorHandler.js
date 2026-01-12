/**
 * ===================================
 * MIDDLEWARE: ERROR HANDLER - XỬ LÝ LỖI
 * ===================================
 * Middleware này xử lý tất cả các lỗi trong ứng dụng
 * Trả về response lỗi thống nhất
 */

/**
 * Middleware xử lý lỗi toàn cục
 * @param {Error} err - Object lỗi
 * @param {Request} req - Express request
 * @param {Response} res - Express response
 * @param {Function} next - Next middleware
 */
const errorHandler = (err, req, res, next) => {
    // Log lỗi để debug
    console.error('❌ Error:', err);

    // Mặc định status code và message
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Lỗi server';

    // Xử lý các loại lỗi Mongoose cụ thể

    // Lỗi CastError - ID không hợp lệ
    if (err.name === 'CastError') {
        statusCode = 400;
        message = 'ID không hợp lệ';
    }

    // Lỗi Duplicate Key - Trùng lặp (ví dụ: email đã tồn tại)
    if (err.code === 11000) {
        statusCode = 400;
        const field = Object.keys(err.keyValue)[0];
        message = `${field} đã tồn tại trong hệ thống`;
    }

    // Lỗi Validation - Dữ liệu không hợp lệ
    if (err.name === 'ValidationError') {
        statusCode = 400;
        const messages = Object.values(err.errors).map(val => val.message);
        message = messages.join(', ');
    }

    // Lỗi JWT
    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Token không hợp lệ';
    }

    if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token đã hết hạn';
    }

    // Trả về response lỗi
    res.status(statusCode).json({
        success: false,
        message,
        // Chỉ hiện stack trace trong môi trường development
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};

/**
 * Middleware xử lý route không tồn tại
 */
const notFound = (req, res, next) => {
    const error = new Error(`Không tìm thấy - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

module.exports = { errorHandler, notFound };
