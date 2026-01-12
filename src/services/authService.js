/**
 * ===================================
 * SERVICE: AUTH - XỬ LÝ XÁC THỰC
 * ===================================
 * Service này xử lý logic nghiệp vụ liên quan đến xác thực:
 * - Đăng ký tài khoản
 * - Đăng nhập
 * - Lấy thông tin user hiện tại
 */

const User = require('../models/User');
const { generateToken } = require('../utils/jwtHelper');

/**
 * Đăng ký tài khoản mới
 * @param {object} userData - Dữ liệu đăng ký (name, email, password)
 * @returns {object} - User mới và token
 */
const register = async (userData) => {
    const { name, email, password } = userData;

    // Kiểm tra email đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        const error = new Error('Email đã được sử dụng');
        error.statusCode = 400;
        throw error;
    }

    // Tạo user mới
    const user = await User.create({
        name,
        email,
        password
    });

    // Tạo token
    const token = generateToken(user._id);

    // Trả về user (không có password) và token
    return {
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt
        },
        token
    };
};

/**
 * Đăng nhập
 * @param {string} email - Email đăng nhập
 * @param {string} password - Mật khẩu
 * @returns {object} - User và token
 */
const login = async (email, password) => {
    // Tìm user theo email, lấy cả password để so sánh
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        const error = new Error('Email hoặc mật khẩu không đúng');
        error.statusCode = 401;
        throw error;
    }

    // Kiểm tra password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        const error = new Error('Email hoặc mật khẩu không đúng');
        error.statusCode = 401;
        throw error;
    }

    // Tạo token
    const token = generateToken(user._id);

    // Trả về user (không có password) và token
    return {
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            age: user.age,
            gender: user.gender,
            height: user.height,
            weight: user.weight,
            createdAt: user.createdAt
        },
        token
    };
};

/**
 * Lấy thông tin user hiện tại
 * @param {string} userId - ID của user
 * @returns {object} - Thông tin user
 */
const getMe = async (userId) => {
    const user = await User.findById(userId);

    if (!user) {
        const error = new Error('Không tìm thấy người dùng');
        error.statusCode = 404;
        throw error;
    }

    return user;
};

module.exports = {
    register,
    login,
    getMe
};
