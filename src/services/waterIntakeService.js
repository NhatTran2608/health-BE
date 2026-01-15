/**
 * ===================================
 * SERVICE: WATER INTAKE - THEO DÕI LƯỢNG NƯỚC UỐNG
 * ===================================
 */

const WaterIntake = require('../models/WaterIntake');

/**
 * Thêm bản ghi uống nước
 */
const addIntake = async (userId, intakeData) => {
    const intake = await WaterIntake.create({
        userId,
        ...intakeData
    });
    return intake;
};

/**
 * Lấy lịch sử uống nước
 */
const getIntakes = async (userId, query) => {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = { userId };

    if (query.startDate || query.endDate) {
        filter.date = {};
        if (query.startDate) {
            filter.date.$gte = new Date(query.startDate);
        }
        if (query.endDate) {
            filter.date.$lte = new Date(query.endDate);
        }
    }

    const intakes = await WaterIntake.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ date: -1, createdAt: -1 });

    const total = await WaterIntake.countDocuments(filter);

    return {
        intakes,
        pagination: {
            page,
            limit,
            total
        }
    };
};

/**
 * Lấy tổng lượng nước uống trong ngày
 */
const getDailyTotal = async (userId, date) => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const intakes = await WaterIntake.find({
        userId,
        date: {
            $gte: startOfDay,
            $lte: endOfDay
        }
    });

    const total = intakes.reduce((sum, intake) => sum + intake.amount, 0);

    return {
        date,
        total,
        intakes
    };
};

/**
 * Lấy thống kê uống nước theo tuần/tháng
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

    const intakes = await WaterIntake.find({
        userId,
        date: { $gte: startDate }
    }).sort({ date: 1 });

    // Nhóm theo ngày
    const dailyStats = {};
    intakes.forEach(intake => {
        const dateKey = intake.date.toISOString().split('T')[0];
        if (!dailyStats[dateKey]) {
            dailyStats[dateKey] = 0;
        }
        dailyStats[dateKey] += intake.amount;
    });

    return {
        period,
        startDate,
        endDate: now,
        dailyStats,
        total: intakes.reduce((sum, intake) => sum + intake.amount, 0),
        average: intakes.length > 0 
            ? intakes.reduce((sum, intake) => sum + intake.amount, 0) / Object.keys(dailyStats).length 
            : 0
    };
};

/**
 * Xóa bản ghi uống nước
 */
const deleteIntake = async (intakeId, userId) => {
    const intake = await WaterIntake.findOneAndDelete({
        _id: intakeId,
        userId
    });

    if (!intake) {
        const error = new Error('Không tìm thấy bản ghi');
        error.statusCode = 404;
        throw error;
    }

    return true;
};

module.exports = {
    addIntake,
    getIntakes,
    getDailyTotal,
    getStatistics,
    deleteIntake
};



