/**
 * ===================================
 * CONTROLLER: USER - XỬ LÝ NGƯỜI DÙNG
 * ===================================
 * Controller này nhận request và trả response cho các API người dùng
 */

const userService = require('../services/userService');
const { successResponse, paginatedResponse } = require('../utils/responseHelper');

/**
 * @desc    Cập nhật thông tin profile
 * @route   PUT /api/users/profile
 * @access  Private
 * 
 * @example Request body:
 * {
 *   "name": "Nguyễn Văn B",
 *   "age": 26,
 *   "gender": "male",
 *   "height": 170,
 *   "weight": 65,
 *   "medicalHistory": "Không có bệnh nền",
 *   "lifestyle": {
 *     "diet": "healthy",
 *     "exercise": "regular",
 *     "sleep": "good",
 *     "smoking": false,
 *     "alcohol": false
 *   }
 * }
 * 
 * @example Response:
 * {
 *   "success": true,
 *   "message": "Cập nhật thông tin thành công",
 *   "data": { ... user info ... }
 * }
 */
const updateProfile = async (req, res, next) => {
    try {
        const user = await userService.updateProfile(req.user._id, req.body);
        return successResponse(res, 200, 'Cập nhật thông tin thành công', user);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Thay đổi mật khẩu
 * @route   PUT /api/users/change-password
 * @access  Private
 * 
 * @example Request body:
 * {
 *   "currentPassword": "123456",
 *   "newPassword": "654321"
 * }
 */
const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        await userService.changePassword(req.user._id, currentPassword, newPassword);
        return successResponse(res, 200, 'Đổi mật khẩu thành công');
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Lấy danh sách tất cả users (Admin)
 * @route   GET /api/users
 * @access  Private/Admin
 * 
 * @example Query: ?page=1&limit=10
 */
const getAllUsers = async (req, res, next) => {
    try {
        const { users, pagination } = await userService.getAllUsers(req.query);
        return paginatedResponse(res, users, pagination);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Xóa user (Admin)
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
const deleteUser = async (req, res, next) => {
    try {
        await userService.deleteUser(req.params.id);
        return successResponse(res, 200, 'Xóa người dùng thành công');
    } catch (error) {
        next(error);
    }
};

module.exports = {
    updateProfile,
    changePassword,
    getAllUsers,
    deleteUser
};
