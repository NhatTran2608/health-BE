/**
 * ===================================
 * SERVICE: SLEEP TRACKER - THEO DÕI GIẤC NGỦ
 * ===================================
 */

const SleepTracker = require('../models/SleepTracker');

/**
 * Thêm bản ghi giấc ngủ
 */
const addSleep = async (userId, sleepData) => {
    const sleep = await SleepTracker.create({
        userId,
        ...sleepData
    });
    return sleep;
};

/**
 * Lấy lịch sử giấc ngủ
 */
const getSleeps = async (userId, query) => {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = { userId };

    if (query.startDate || query.endDate) {
        filter.sleepDate = {};
        if (query.startDate) {
            filter.sleepDate.$gte = new Date(query.startDate);
        }
        if (query.endDate) {
            filter.sleepDate.$lte = new Date(query.endDate);
        }
    }

    const sleeps = await SleepTracker.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ sleepDate: -1, createdAt: -1 });

    const total = await SleepTracker.countDocuments(filter);

    return {
        sleeps,
        pagination: {
            page,
            limit,
            total
        }
    };
};

/**
 * Lấy một bản ghi giấc ngủ theo ID
 */
const getSleepById = async (sleepId, userId) => {
    const sleep = await SleepTracker.findOne({
        _id: sleepId,
        userId
    });

    if (!sleep) {
        const error = new Error('Không tìm thấy bản ghi giấc ngủ');
        error.statusCode = 404;
        throw error;
    }

    return sleep;
};

/**
 * Cập nhật bản ghi giấc ngủ
 */
const updateSleep = async (sleepId, userId, updateData) => {
    const sleep = await SleepTracker.findOneAndUpdate(
        { _id: sleepId, userId },
        updateData,
        { new: true, runValidators: true }
    );

    if (!sleep) {
        const error = new Error('Không tìm thấy bản ghi giấc ngủ');
        error.statusCode = 404;
        throw error;
    }

    return sleep;
};

/**
 * Xóa bản ghi giấc ngủ
 */
const deleteSleep = async (sleepId, userId) => {
    const sleep = await SleepTracker.findOneAndDelete({
        _id: sleepId,
        userId
    });

    if (!sleep) {
        const error = new Error('Không tìm thấy bản ghi giấc ngủ');
        error.statusCode = 404;
        throw error;
    }

    return true;
};

/**
 * Lấy thống kê giấc ngủ
 */
const getStatistics = async (userId, period = 'week') => {
    const now = new Date();
    let startDate;

    if (period === 'week') {
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
    } else if (period === 'month') {
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
    } else {
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
    }

    const sleeps = await SleepTracker.find({
        userId,
        sleepDate: { $gte: startDate }
    }).sort({ sleepDate: 1 });

    const totalSleepMinutes = sleeps.reduce((sum, sleep) => sum + (sleep.totalSleepMinutes || 0), 0);
    const averageSleepMinutes = sleeps.length > 0 ? totalSleepMinutes / sleeps.length : 0;
    const averageSleepHours = averageSleepMinutes / 60;

    // Thống kê theo chất lượng
    const byQuality = {
        excellent: 0,
        good: 0,
        fair: 0,
        poor: 0
    };
    sleeps.forEach(sleep => {
        if (sleep.quality) {
            byQuality[sleep.quality]++;
        }
    });

    return {
        period,
        startDate,
        endDate: now,
        totalDays: sleeps.length,
        totalSleepMinutes,
        averageSleepMinutes,
        averageSleepHours: Math.round(averageSleepHours * 10) / 10,
        byQuality
    };
};

module.exports = {
    addSleep,
    getSleeps,
    getSleepById,
    updateSleep,
    deleteSleep,
    getStatistics
};



