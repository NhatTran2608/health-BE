/**
 * ===================================
 * SERVICE: USER - XỬ LÝ NGƯỜI DÙNG
 * ===================================
 * Service này xử lý logic nghiệp vụ liên quan đến người dùng:
 * - Cập nhật thông tin cá nhân
 * - Cập nhật hồ sơ sức khỏe
 * - Thay đổi mật khẩu
 */

const User = require('../models/User');

/**
 * Cập nhật thông tin profile của user
 * @param {string} userId - ID của user
 * @param {object} updateData - Dữ liệu cập nhật
 * @returns {object} - User đã cập nhật
 */
const updateProfile = async (userId, updateData) => {
    // Các trường được phép cập nhật
    const allowedFields = [
        'name', 'age', 'gender', 'height', 'weight',
        'medicalHistory', 'lifestyle'
    ];

    // Lọc chỉ lấy các trường được phép
    const filteredData = {};
    Object.keys(updateData).forEach(key => {
        if (allowedFields.includes(key)) {
            filteredData[key] = updateData[key];
        }
    });

    // Cập nhật user
    const user = await User.findByIdAndUpdate(
        userId,
        filteredData,
        {
            new: true, // Trả về document đã cập nhật
            runValidators: true // Chạy validation
        }
    );

    if (!user) {
        const error = new Error('Không tìm thấy người dùng');
        error.statusCode = 404;
        throw error;
    }

    return user;
};

/**
 * Thay đổi mật khẩu
 * @param {string} userId - ID của user
 * @param {string} currentPassword - Mật khẩu hiện tại
 * @param {string} newPassword - Mật khẩu mới
 * @returns {boolean} - Thành công hay không
 */
const changePassword = async (userId, currentPassword, newPassword) => {
    // Lấy user kèm password
    const user = await User.findById(userId).select('+password');

    if (!user) {
        const error = new Error('Không tìm thấy người dùng');
        error.statusCode = 404;
        throw error;
    }

    // Kiểm tra mật khẩu hiện tại
    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
        const error = new Error('Mật khẩu hiện tại không đúng');
        error.statusCode = 400;
        throw error;
    }

    // Cập nhật mật khẩu mới
    user.password = newPassword;
    await user.save();

    return true;
};

/**
 * Lấy danh sách tất cả users (chỉ admin)
 * @param {object} query - Query parameters (page, limit)
 * @returns {object} - Danh sách users và thông tin phân trang
 */
const getAllUsers = async (query) => {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

    const total = await User.countDocuments();

    return {
        users,
        pagination: {
            page,
            limit,
            total
        }
    };
};

/**
 * Xóa user (chỉ admin)
 * @param {string} userId - ID của user cần xóa
 * @returns {boolean} - Thành công hay không
 */
const deleteUser = async (userId) => {
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
        const error = new Error('Không tìm thấy người dùng');
        error.statusCode = 404;
        throw error;
    }

    return true;
};

module.exports = {
    updateProfile,
    changePassword,
    getAllUsers,
    deleteUser
};
