/**
 * ===================================
 * MIDDLEWARE: VALIDATOR - XÁC THỰC DỮ LIỆU
 * ===================================
 * Middleware này xác thực dữ liệu đầu vào từ request
 * Sử dụng express-validator
 */

const { body, validationResult } = require('express-validator');

/**
 * Middleware xử lý kết quả validation
 * Kiểm tra và trả về lỗi nếu có
 */
const handleValidation = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Dữ liệu không hợp lệ',
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }

    next();
};

// ===== VALIDATION RULES CHO USER =====

/**
 * Rules cho đăng ký tài khoản
 */
const registerValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Họ tên không được để trống')
        .isLength({ max: 100 }).withMessage('Họ tên không được quá 100 ký tự'),

    body('email')
        .trim()
        .notEmpty().withMessage('Email không được để trống')
        .isEmail().withMessage('Email không hợp lệ')
        .normalizeEmail(),

    body('password')
        .notEmpty().withMessage('Mật khẩu không được để trống')
        .isLength({ min: 6 }).withMessage('Mật khẩu phải có ít nhất 6 ký tự'),

    handleValidation
];

/**
 * Rules cho đăng nhập
 */
const loginValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email không được để trống')
        .isEmail().withMessage('Email không hợp lệ'),

    body('password')
        .notEmpty().withMessage('Mật khẩu không được để trống'),

    handleValidation
];

/**
 * Rules cho cập nhật profile
 */
const updateProfileValidation = [
    body('name')
        .optional()
        .trim()
        .isLength({ max: 100 }).withMessage('Họ tên không được quá 100 ký tự'),

    body('age')
        .optional()
        .isInt({ min: 1, max: 150 }).withMessage('Tuổi không hợp lệ'),

    body('gender')
        .optional()
        .isIn(['male', 'female', 'other']).withMessage('Giới tính không hợp lệ'),

    body('height')
        .optional()
        .isFloat({ min: 0 }).withMessage('Chiều cao không hợp lệ'),

    body('weight')
        .optional()
        .isFloat({ min: 0 }).withMessage('Cân nặng không hợp lệ'),

    handleValidation
];

// ===== VALIDATION RULES CHO HEALTH RECORD =====

/**
 * Rules cho tạo bản ghi sức khỏe
 */
const healthRecordValidation = [
    body('height')
        .optional()
        .isFloat({ min: 0, max: 300 }).withMessage('Chiều cao không hợp lệ'),

    body('weight')
        .optional()
        .isFloat({ min: 0, max: 500 }).withMessage('Cân nặng không hợp lệ'),

    body('bloodPressure.systolic')
        .optional()
        .isInt({ min: 0 }).withMessage('Huyết áp tâm thu không hợp lệ'),

    body('bloodPressure.diastolic')
        .optional()
        .isInt({ min: 0 }).withMessage('Huyết áp tâm trương không hợp lệ'),

    body('heartRate')
        .optional()
        .isInt({ min: 0, max: 300 }).withMessage('Nhịp tim không hợp lệ'),

    body('note')
        .optional()
        .isLength({ max: 500 }).withMessage('Ghi chú không được quá 500 ký tự'),

    handleValidation
];

// ===== VALIDATION RULES CHO REMINDER =====

/**
 * Rules cho tạo nhắc nhở
 */
const reminderValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Tiêu đề không được để trống')
        .isLength({ max: 100 }).withMessage('Tiêu đề không được quá 100 ký tự'),

    body('description')
        .optional()
        .isLength({ max: 500 }).withMessage('Mô tả không được quá 500 ký tự'),

    body('time')
        .notEmpty().withMessage('Thời gian không được để trống')
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Định dạng thời gian không hợp lệ (HH:MM)'),

    body('type')
        .optional()
        .isIn(['medicine', 'exercise', 'sleep', 'water', 'meal', 'checkup', 'other'])
        .withMessage('Loại nhắc nhở không hợp lệ'),

    handleValidation
];

// ===== VALIDATION RULES CHO CHATBOT =====

/**
 * Rules cho câu hỏi chatbot
 */
const chatbotValidation = [
    body('question')
        .trim()
        .notEmpty().withMessage('Câu hỏi không được để trống')
        .isLength({ max: 1000 }).withMessage('Câu hỏi không được quá 1000 ký tự'),

    handleValidation
];

module.exports = {
    handleValidation,
    registerValidation,
    loginValidation,
    updateProfileValidation,
    healthRecordValidation,
    reminderValidation,
    chatbotValidation
};
