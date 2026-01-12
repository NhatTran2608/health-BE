/**
 * ===================================
 * CONTROLLER: REMINDER - NHẮC NHỞ
 * ===================================
 * Controller này nhận request và trả response cho các API nhắc nhở
 */

const reminderService = require('../services/reminderService');
const { successResponse, paginatedResponse } = require('../utils/responseHelper');

/**
 * @desc    Tạo nhắc nhở mới
 * @route   POST /api/reminders
 * @access  Private
 * 
 * @example Request body:
 * {
 *   "title": "Uống thuốc huyết áp",
 *   "description": "Uống 1 viên sau bữa sáng",
 *   "type": "medicine",
 *   "time": "07:30",
 *   "daysOfWeek": [1, 2, 3, 4, 5, 6, 0],
 *   "isActive": true
 * }
 * 
 * @example Response:
 * {
 *   "success": true,
 *   "message": "Tạo nhắc nhở thành công",
 *   "data": { ... reminder ... }
 * }
 */
const createReminder = async (req, res, next) => {
    try {
        const reminder = await reminderService.createReminder(req.user._id, req.body);
        return successResponse(res, 201, 'Tạo nhắc nhở thành công', reminder);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Lấy danh sách nhắc nhở
 * @route   GET /api/reminders
 * @access  Private
 * 
 * @example Query: ?page=1&limit=20&isActive=true&type=medicine
 */
const getReminders = async (req, res, next) => {
    try {
        const { reminders, pagination } = await reminderService.getReminders(
            req.user._id,
            req.query
        );
        return paginatedResponse(res, reminders, pagination);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Lấy một nhắc nhở theo ID
 * @route   GET /api/reminders/:id
 * @access  Private
 */
const getReminderById = async (req, res, next) => {
    try {
        const reminder = await reminderService.getReminderById(
            req.params.id,
            req.user._id
        );
        return successResponse(res, 200, 'Thành công', reminder);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Cập nhật nhắc nhở
 * @route   PUT /api/reminders/:id
 * @access  Private
 * 
 * @example Request body:
 * {
 *   "title": "Uống thuốc tim",
 *   "time": "08:00"
 * }
 */
const updateReminder = async (req, res, next) => {
    try {
        const reminder = await reminderService.updateReminder(
            req.params.id,
            req.user._id,
            req.body
        );
        return successResponse(res, 200, 'Cập nhật nhắc nhở thành công', reminder);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Xóa nhắc nhở
 * @route   DELETE /api/reminders/:id
 * @access  Private
 */
const deleteReminder = async (req, res, next) => {
    try {
        await reminderService.deleteReminder(req.params.id, req.user._id);
        return successResponse(res, 200, 'Xóa nhắc nhở thành công');
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Bật/tắt nhắc nhở
 * @route   PUT /api/reminders/:id/toggle
 * @access  Private
 * 
 * @example Request body:
 * {
 *   "isActive": false
 * }
 */
const toggleReminder = async (req, res, next) => {
    try {
        const { isActive } = req.body;
        const reminder = await reminderService.toggleReminder(
            req.params.id,
            req.user._id,
            isActive
        );

        const message = isActive ? 'Đã bật nhắc nhở' : 'Đã tắt nhắc nhở';
        return successResponse(res, 200, message, reminder);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createReminder,
    getReminders,
    getReminderById,
    updateReminder,
    deleteReminder,
    toggleReminder
};
