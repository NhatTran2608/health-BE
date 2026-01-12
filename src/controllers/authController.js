/**
 * ===================================
 * CONTROLLER: AUTH - XỬ LÝ XÁC THỰC
 * ===================================
 * Controller này nhận request và trả response cho các API xác thực
 */

const authService = require('../services/authService');
const { successResponse, errorResponse } = require('../utils/responseHelper');

/**
 * @desc    Đăng ký tài khoản mới
 * @route   POST /api/auth/register
 * @access  Public
 * 
 * @example Request body:
 * {
 *   "name": "Nguyễn Văn A",
 *   "email": "nguyenvana@email.com",
 *   "password": "123456"
 * }
 * 
 * @example Response:
 * {
 *   "success": true,
 *   "message": "Đăng ký thành công",
 *   "data": {
 *     "user": { "_id": "...", "name": "...", "email": "..." },
 *     "token": "eyJhbGciOiJI..."
 *   }
 * }
 */
const register = async (req, res, next) => {
    try {
        const result = await authService.register(req.body);
        return successResponse(res, 201, 'Đăng ký thành công', result);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Đăng nhập
 * @route   POST /api/auth/login
 * @access  Public
 * 
 * @example Request body:
 * {
 *   "email": "nguyenvana@email.com",
 *   "password": "123456"
 * }
 * 
 * @example Response:
 * {
 *   "success": true,
 *   "message": "Đăng nhập thành công",
 *   "data": {
 *     "user": { "_id": "...", "name": "...", "email": "..." },
 *     "token": "eyJhbGciOiJI..."
 *   }
 * }
 */
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await authService.login(email, password);
        return successResponse(res, 200, 'Đăng nhập thành công', result);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Lấy thông tin user đang đăng nhập
 * @route   GET /api/auth/me
 * @access  Private (cần token)
 * 
 * @example Response:
 * {
 *   "success": true,
 *   "message": "Thành công",
 *   "data": {
 *     "_id": "...",
 *     "name": "Nguyễn Văn A",
 *     "email": "nguyenvana@email.com",
 *     "age": 25,
 *     "gender": "male",
 *     ...
 *   }
 * }
 */
const getMe = async (req, res, next) => {
    try {
        const user = await authService.getMe(req.user._id);
        return successResponse(res, 200, 'Thành công', user);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Đăng xuất (client side - xóa token)
 * @route   POST /api/auth/logout
 * @access  Private
 * 
 * @note    Việc đăng xuất chủ yếu xử lý ở client (xóa token khỏi localStorage)
 *          API này chỉ để xác nhận đăng xuất thành công
 */
const logout = async (req, res, next) => {
    try {
        // Có thể thêm logic blacklist token ở đây nếu cần
        return successResponse(res, 200, 'Đăng xuất thành công');
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    getMe,
    logout
};
