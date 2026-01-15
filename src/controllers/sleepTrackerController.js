/**
 * ===================================
 * CONTROLLER: SLEEP TRACKER - THEO DÕI GIẤC NGỦ
 * ===================================
 */

const sleepTrackerService = require('../services/sleepTrackerService');
const { successResponse, paginatedResponse } = require('../utils/responseHelper');

const addSleep = async (req, res, next) => {
    try {
        const sleep = await sleepTrackerService.addSleep(req.user._id, req.body);
        return successResponse(res, 201, 'Thêm bản ghi giấc ngủ thành công', sleep);
    } catch (error) {
        next(error);
    }
};

const getSleeps = async (req, res, next) => {
    try {
        const { sleeps, pagination } = await sleepTrackerService.getSleeps(
            req.user._id,
            req.query
        );
        return paginatedResponse(res, sleeps, pagination);
    } catch (error) {
        next(error);
    }
};

const getSleepById = async (req, res, next) => {
    try {
        const sleep = await sleepTrackerService.getSleepById(
            req.params.id,
            req.user._id
        );
        return successResponse(res, 200, 'Thành công', sleep);
    } catch (error) {
        next(error);
    }
};

const updateSleep = async (req, res, next) => {
    try {
        const sleep = await sleepTrackerService.updateSleep(
            req.params.id,
            req.user._id,
            req.body
        );
        return successResponse(res, 200, 'Cập nhật bản ghi thành công', sleep);
    } catch (error) {
        next(error);
    }
};

const deleteSleep = async (req, res, next) => {
    try {
        await sleepTrackerService.deleteSleep(req.params.id, req.user._id);
        return successResponse(res, 200, 'Xóa bản ghi thành công');
    } catch (error) {
        next(error);
    }
};

const getStatistics = async (req, res, next) => {
    try {
        const period = req.query.period || 'week';
        const stats = await sleepTrackerService.getStatistics(req.user._id, period);
        return successResponse(res, 200, 'Thành công', stats);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    addSleep,
    getSleeps,
    getSleepById,
    updateSleep,
    deleteSleep,
    getStatistics
};



