/**
 * ===================================
 * CONTROLLER: EXERCISE LOG - NHẬT KÝ TẬP LUYỆN
 * ===================================
 */

const exerciseLogService = require('../services/exerciseLogService');
const { successResponse, paginatedResponse } = require('../utils/responseHelper');

const addExercise = async (req, res, next) => {
    try {
        const exercise = await exerciseLogService.addExercise(req.user._id, req.body);
        return successResponse(res, 201, 'Thêm bản ghi tập luyện thành công', exercise);
    } catch (error) {
        next(error);
    }
};

const getExercises = async (req, res, next) => {
    try {
        const { exercises, pagination } = await exerciseLogService.getExercises(
            req.user._id,
            req.query
        );
        return paginatedResponse(res, exercises, pagination);
    } catch (error) {
        next(error);
    }
};

const getExerciseById = async (req, res, next) => {
    try {
        const exercise = await exerciseLogService.getExerciseById(
            req.params.id,
            req.user._id
        );
        return successResponse(res, 200, 'Thành công', exercise);
    } catch (error) {
        next(error);
    }
};

const updateExercise = async (req, res, next) => {
    try {
        const exercise = await exerciseLogService.updateExercise(
            req.params.id,
            req.user._id,
            req.body
        );
        return successResponse(res, 200, 'Cập nhật bản ghi thành công', exercise);
    } catch (error) {
        next(error);
    }
};

const deleteExercise = async (req, res, next) => {
    try {
        await exerciseLogService.deleteExercise(req.params.id, req.user._id);
        return successResponse(res, 200, 'Xóa bản ghi thành công');
    } catch (error) {
        next(error);
    }
};

const getStatistics = async (req, res, next) => {
    try {
        const period = req.query.period || 'week';
        const stats = await exerciseLogService.getStatistics(req.user._id, period);
        return successResponse(res, 200, 'Thành công', stats);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    addExercise,
    getExercises,
    getExerciseById,
    updateExercise,
    deleteExercise,
    getStatistics
};



