/**
 * ===================================
 * CONTROLLER: WATER INTAKE - THEO DÕI LƯỢNG NƯỚC UỐNG
 * ===================================
 */

const waterIntakeService = require('../services/waterIntakeService');
const { successResponse, paginatedResponse } = require('../utils/responseHelper');

const addIntake = async (req, res, next) => {
    try {
        const intake = await waterIntakeService.addIntake(req.user._id, req.body);
        return successResponse(res, 201, 'Thêm bản ghi uống nước thành công', intake);
    } catch (error) {
        next(error);
    }
};

const getIntakes = async (req, res, next) => {
    try {
        const { intakes, pagination } = await waterIntakeService.getIntakes(
            req.user._id,
            req.query
        );
        return paginatedResponse(res, intakes, pagination);
    } catch (error) {
        next(error);
    }
};

const getDailyTotal = async (req, res, next) => {
    try {
        const date = req.query.date ? new Date(req.query.date) : new Date();
        const result = await waterIntakeService.getDailyTotal(req.user._id, date);
        return successResponse(res, 200, 'Thành công', result);
    } catch (error) {
        next(error);
    }
};

const getStatistics = async (req, res, next) => {
    try {
        const period = req.query.period || 'week';
        const stats = await waterIntakeService.getStatistics(req.user._id, period);
        return successResponse(res, 200, 'Thành công', stats);
    } catch (error) {
        next(error);
    }
};

const deleteIntake = async (req, res, next) => {
    try {
        await waterIntakeService.deleteIntake(req.params.id, req.user._id);
        return successResponse(res, 200, 'Xóa bản ghi thành công');
    } catch (error) {
        next(error);
    }
};

module.exports = {
    addIntake,
    getIntakes,
    getDailyTotal,
    getStatistics,
    deleteIntake
};



