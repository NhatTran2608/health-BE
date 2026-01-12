/**
 * ===================================
 * SERVICE: REMINDER - NHẮC NHỞ
 * ===================================
 * Service này xử lý logic nghiệp vụ liên quan đến nhắc nhở:
 * - Tạo nhắc nhở
 * - Cập nhật nhắc nhở
 * - Xóa nhắc nhở
 * - Bật/tắt nhắc nhở
 */

const Reminder = require('../models/Reminder');

/**
 * Tạo nhắc nhở mới
 * @param {string} userId - ID của user
 * @param {object} reminderData - Dữ liệu nhắc nhở
 * @returns {object} - Nhắc nhở mới
 */
const createReminder = async (userId, reminderData) => {
    const reminder = await Reminder.create({
        userId,
        ...reminderData
    });

    return reminder;
};

/**
 * Lấy danh sách nhắc nhở của user
 * @param {string} userId - ID của user
 * @param {object} query - Query parameters
 * @returns {object} - Danh sách nhắc nhở và phân trang
 */
const getReminders = async (userId, query) => {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 20;
    const skip = (page - 1) * limit;

    // Xây dựng filter
    const filter = { userId };

    // Lọc theo trạng thái active nếu có
    if (query.isActive !== undefined) {
        filter.isActive = query.isActive === 'true';
    }

    // Lọc theo loại nếu có
    if (query.type) {
        filter.type = query.type;
    }

    const reminders = await Reminder.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ time: 1 }); // Sắp xếp theo thời gian

    const total = await Reminder.countDocuments(filter);

    return {
        reminders,
        pagination: {
            page,
            limit,
            total
        }
    };
};

/**
 * Lấy một nhắc nhở theo ID
 * @param {string} reminderId - ID của nhắc nhở
 * @param {string} userId - ID của user
 * @returns {object} - Nhắc nhở
 */
const getReminderById = async (reminderId, userId) => {
    const reminder = await Reminder.findOne({
        _id: reminderId,
        userId
    });

    if (!reminder) {
        const error = new Error('Không tìm thấy nhắc nhở');
        error.statusCode = 404;
        throw error;
    }

    return reminder;
};

/**
 * Cập nhật nhắc nhở
 * @param {string} reminderId - ID của nhắc nhở
 * @param {string} userId - ID của user
 * @param {object} updateData - Dữ liệu cập nhật
 * @returns {object} - Nhắc nhở đã cập nhật
 */
const updateReminder = async (reminderId, userId, updateData) => {
    const reminder = await Reminder.findOneAndUpdate(
        { _id: reminderId, userId },
        { ...updateData, updatedAt: Date.now() },
        { new: true, runValidators: true }
    );

    if (!reminder) {
        const error = new Error('Không tìm thấy nhắc nhở');
        error.statusCode = 404;
        throw error;
    }

    return reminder;
};

/**
 * Xóa nhắc nhở
 * @param {string} reminderId - ID của nhắc nhở
 * @param {string} userId - ID của user
 * @returns {boolean} - Thành công hay không
 */
const deleteReminder = async (reminderId, userId) => {
    const reminder = await Reminder.findOneAndDelete({
        _id: reminderId,
        userId
    });

    if (!reminder) {
        const error = new Error('Không tìm thấy nhắc nhở');
        error.statusCode = 404;
        throw error;
    }

    return true;
};

/**
 * Bật/tắt nhắc nhở
 * @param {string} reminderId - ID của nhắc nhở
 * @param {string} userId - ID của user
 * @param {boolean} isActive - Trạng thái mới
 * @returns {object} - Nhắc nhở đã cập nhật
 */
const toggleReminder = async (reminderId, userId, isActive) => {
    const reminder = await Reminder.findOneAndUpdate(
        { _id: reminderId, userId },
        { isActive, updatedAt: Date.now() },
        { new: true }
    );

    if (!reminder) {
        const error = new Error('Không tìm thấy nhắc nhở');
        error.statusCode = 404;
        throw error;
    }

    return reminder;
};

/**
 * Lấy nhắc nhở đang active theo thời gian
 * Dùng để kiểm tra nhắc nhở cần thông báo
 * @param {string} userId - ID của user
 * @param {string} time - Thời gian hiện tại (HH:MM)
 * @param {number} dayOfWeek - Ngày trong tuần (0-6)
 * @returns {array} - Danh sách nhắc nhở cần thông báo
 */
const getActiveRemindersAtTime = async (userId, time, dayOfWeek) => {
    const reminders = await Reminder.find({
        userId,
        isActive: true,
        time,
        $or: [
            { daysOfWeek: { $size: 0 } }, // Nếu không set ngày cụ thể
            { daysOfWeek: dayOfWeek }      // Hoặc ngày hiện tại nằm trong danh sách
        ]
    });

    return reminders;
};

module.exports = {
    createReminder,
    getReminders,
    getReminderById,
    updateReminder,
    deleteReminder,
    toggleReminder,
    getActiveRemindersAtTime
};
