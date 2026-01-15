/**
 * ===================================
 * CONTROLLER: HEALTH GOAL - MỤC TIÊU SỨC KHỎE
 * ===================================
 */

const healthGoalService = require('../services/healthGoalService');
const { successResponse, paginatedResponse } = require('../utils/responseHelper');

const createGoal = async (req, res, next) => {
    try {
        const goal = await healthGoalService.createGoal(req.user._id, req.body);
        return successResponse(res, 201, 'Tạo mục tiêu thành công', goal);
    } catch (error) {
        next(error);
    }
};

const getGoals = async (req, res, next) => {
    try {
        const { goals, pagination } = await healthGoalService.getGoals(
            req.user._id,
            req.query
        );
        return paginatedResponse(res, goals, pagination);
    } catch (error) {
        next(error);
    }
};

const getGoalById = async (req, res, next) => {
    try {
        const goal = await healthGoalService.getGoalById(
            req.params.id,
            req.user._id
        );
        return successResponse(res, 200, 'Thành công', goal);
    } catch (error) {
        next(error);
    }
};

const updateGoal = async (req, res, next) => {
    try {
        const goal = await healthGoalService.updateGoal(
            req.params.id,
            req.user._id,
            req.body
        );
        return successResponse(res, 200, 'Cập nhật mục tiêu thành công', goal);
    } catch (error) {
        next(error);
    }
};

const deleteGoal = async (req, res, next) => {
    try {
        await healthGoalService.deleteGoal(req.params.id, req.user._id);
        return successResponse(res, 200, 'Xóa mục tiêu thành công');
    } catch (error) {
        next(error);
    }
};

const updateProgress = async (req, res, next) => {
    try {
        const { currentValue } = req.body;
        const goal = await healthGoalService.updateProgress(
            req.params.id,
            req.user._id,
            currentValue
        );
        return successResponse(res, 200, 'Cập nhật tiến độ thành công', goal);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createGoal,
    getGoals,
    getGoalById,
    updateGoal,
    deleteGoal,
    updateProgress
};



