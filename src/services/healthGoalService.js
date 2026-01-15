/**
 * ===================================
 * SERVICE: HEALTH GOAL - MỤC TIÊU SỨC KHỎE
 * ===================================
 */

const HealthGoal = require('../models/HealthGoal');

/**
 * Tạo mục tiêu sức khỏe mới
 */
const createGoal = async (userId, goalData) => {
    const goal = await HealthGoal.create({
        userId,
        ...goalData
    });
    return goal;
};

/**
 * Lấy tất cả mục tiêu của user
 */
const getGoals = async (userId, query) => {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = { userId };
    
    if (query.status) {
        filter.status = query.status;
    }
    
    if (query.type) {
        filter.type = query.type;
    }

    const goals = await HealthGoal.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

    const total = await HealthGoal.countDocuments(filter);

    return {
        goals,
        pagination: {
            page,
            limit,
            total
        }
    };
};

/**
 * Lấy một mục tiêu theo ID
 */
const getGoalById = async (goalId, userId) => {
    const goal = await HealthGoal.findOne({
        _id: goalId,
        userId
    });

    if (!goal) {
        const error = new Error('Không tìm thấy mục tiêu');
        error.statusCode = 404;
        throw error;
    }

    return goal;
};

/**
 * Cập nhật mục tiêu
 */
const updateGoal = async (goalId, userId, updateData) => {
    const goal = await HealthGoal.findOneAndUpdate(
        { _id: goalId, userId },
        updateData,
        { new: true, runValidators: true }
    );

    if (!goal) {
        const error = new Error('Không tìm thấy mục tiêu');
        error.statusCode = 404;
        throw error;
    }

    return goal;
};

/**
 * Xóa mục tiêu
 */
const deleteGoal = async (goalId, userId) => {
    const goal = await HealthGoal.findOneAndDelete({
        _id: goalId,
        userId
    });

    if (!goal) {
        const error = new Error('Không tìm thấy mục tiêu');
        error.statusCode = 404;
        throw error;
    }

    return true;
};

/**
 * Cập nhật tiến độ mục tiêu
 */
const updateProgress = async (goalId, userId, currentValue) => {
    const goal = await HealthGoal.findOne({ _id: goalId, userId });
    
    if (!goal) {
        const error = new Error('Không tìm thấy mục tiêu');
        error.statusCode = 404;
        throw error;
    }

    goal.currentValue = currentValue;
    await goal.save();

    return goal;
};

module.exports = {
    createGoal,
    getGoals,
    getGoalById,
    updateGoal,
    deleteGoal,
    updateProgress
};



