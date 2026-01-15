/**
 * ===================================
 * SERVICE: EXERCISE LOG - NHẬT KÝ TẬP LUYỆN
 * ===================================
 */

const ExerciseLog = require('../models/ExerciseLog');

/**
 * Thêm bản ghi tập luyện
 */
const addExercise = async (userId, exerciseData) => {
    const exercise = await ExerciseLog.create({
        userId,
        ...exerciseData
    });
    return exercise;
};

/**
 * Lấy lịch sử tập luyện
 */
const getExercises = async (userId, query) => {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = { userId };

    if (query.exerciseType) {
        filter.exerciseType = query.exerciseType;
    }

    if (query.startDate || query.endDate) {
        filter.exerciseDate = {};
        if (query.startDate) {
            filter.exerciseDate.$gte = new Date(query.startDate);
        }
        if (query.endDate) {
            filter.exerciseDate.$lte = new Date(query.endDate);
        }
    }

    const exercises = await ExerciseLog.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ exerciseDate: -1, createdAt: -1 });

    const total = await ExerciseLog.countDocuments(filter);

    return {
        exercises,
        pagination: {
            page,
            limit,
            total
        }
    };
};

/**
 * Lấy một bản ghi tập luyện theo ID
 */
const getExerciseById = async (exerciseId, userId) => {
    const exercise = await ExerciseLog.findOne({
        _id: exerciseId,
        userId
    });

    if (!exercise) {
        const error = new Error('Không tìm thấy bản ghi tập luyện');
        error.statusCode = 404;
        throw error;
    }

    return exercise;
};

/**
 * Cập nhật bản ghi tập luyện
 */
const updateExercise = async (exerciseId, userId, updateData) => {
    const exercise = await ExerciseLog.findOneAndUpdate(
        { _id: exerciseId, userId },
        updateData,
        { new: true, runValidators: true }
    );

    if (!exercise) {
        const error = new Error('Không tìm thấy bản ghi tập luyện');
        error.statusCode = 404;
        throw error;
    }

    return exercise;
};

/**
 * Xóa bản ghi tập luyện
 */
const deleteExercise = async (exerciseId, userId) => {
    const exercise = await ExerciseLog.findOneAndDelete({
        _id: exerciseId,
        userId
    });

    if (!exercise) {
        const error = new Error('Không tìm thấy bản ghi tập luyện');
        error.statusCode = 404;
        throw error;
    }

    return true;
};

/**
 * Lấy thống kê tập luyện
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

    const exercises = await ExerciseLog.find({
        userId,
        exerciseDate: { $gte: startDate }
    });

    const totalDuration = exercises.reduce((sum, ex) => sum + (ex.duration || 0), 0);
    const totalCalories = exercises.reduce((sum, ex) => sum + (ex.caloriesBurned || 0), 0);
    const totalDistance = exercises.reduce((sum, ex) => sum + (ex.distance || 0), 0);

    // Thống kê theo loại bài tập
    const byType = {};
    exercises.forEach(ex => {
        if (!byType[ex.exerciseType]) {
            byType[ex.exerciseType] = {
                count: 0,
                totalDuration: 0,
                totalCalories: 0
            };
        }
        byType[ex.exerciseType].count++;
        byType[ex.exerciseType].totalDuration += ex.duration || 0;
        byType[ex.exerciseType].totalCalories += ex.caloriesBurned || 0;
    });

    return {
        period,
        startDate,
        endDate: now,
        totalExercises: exercises.length,
        totalDuration,
        totalCalories,
        totalDistance,
        averageDuration: exercises.length > 0 ? totalDuration / exercises.length : 0,
        byType
    };
};

module.exports = {
    addExercise,
    getExercises,
    getExerciseById,
    updateExercise,
    deleteExercise,
    getStatistics
};



