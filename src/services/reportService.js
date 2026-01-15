/**
 * ===================================
 * SERVICE: REPORT - BÁO CÁO & THỐNG KÊ
 * ===================================
 * Service này xử lý logic nghiệp vụ liên quan đến báo cáo:
 * - Thống kê sức khỏe theo thời gian
 * - Thống kê lịch sử tư vấn
 * - Báo cáo tổng quan
 */

const HealthRecord = require('../models/HealthRecord');
const ChatHistory = require('../models/ChatHistory');
const Reminder = require('../models/Reminder');
const HealthGoal = require('../models/HealthGoal');
const WaterIntake = require('../models/WaterIntake');
const ExerciseLog = require('../models/ExerciseLog');
const SleepTracker = require('../models/SleepTracker');

/**
 * Lấy báo cáo sức khỏe theo thời gian
 * Dữ liệu dùng để vẽ biểu đồ
 * @param {string} userId - ID của user
 * @param {object} query - Query parameters (startDate, endDate, type)
 * @returns {object} - Dữ liệu báo cáo
 */
const getHealthReport = async (userId, query) => {
    // Xác định khoảng thời gian
    const endDate = query.endDate ? new Date(query.endDate) : new Date();
    const startDate = query.startDate
        ? new Date(query.startDate)
        : new Date(endDate - 30 * 24 * 60 * 60 * 1000); // Mặc định 30 ngày

    // Lấy tất cả bản ghi trong khoảng thời gian
    const records = await HealthRecord.find({
        userId,
        createdAt: {
            $gte: startDate,
            $lte: endDate
        }
    }).sort({ createdAt: 1 });

    // Tạo dữ liệu cho biểu đồ
    const chartData = {
        // Dữ liệu cân nặng theo ngày
        weight: records.map(r => ({
            date: r.createdAt,
            value: r.weight
        })).filter(d => d.value),

        // Dữ liệu chiều cao (thường ít thay đổi)
        height: records.map(r => ({
            date: r.createdAt,
            value: r.height
        })).filter(d => d.value),

        // Dữ liệu BMI
        bmi: records.map(r => ({
            date: r.createdAt,
            value: r.bmi
        })).filter(d => d.value),

        // Dữ liệu huyết áp
        bloodPressure: records.map(r => ({
            date: r.createdAt,
            systolic: r.bloodPressure?.systolic,
            diastolic: r.bloodPressure?.diastolic
        })).filter(d => d.systolic && d.diastolic),

        // Dữ liệu nhịp tim
        heartRate: records.map(r => ({
            date: r.createdAt,
            value: r.heartRate
        })).filter(d => d.value)
    };

    // Tính toán thống kê
    const stats = {
        totalRecords: records.length,
        dateRange: {
            start: startDate,
            end: endDate
        }
    };

    // Tính trung bình nếu có dữ liệu
    if (chartData.weight.length > 0) {
        const weights = chartData.weight.map(d => d.value);
        stats.weight = {
            min: Math.min(...weights),
            max: Math.max(...weights),
            avg: (weights.reduce((a, b) => a + b, 0) / weights.length).toFixed(1),
            latest: weights[weights.length - 1]
        };
    }

    if (chartData.heartRate.length > 0) {
        const rates = chartData.heartRate.map(d => d.value);
        stats.heartRate = {
            min: Math.min(...rates),
            max: Math.max(...rates),
            avg: Math.round(rates.reduce((a, b) => a + b, 0) / rates.length),
            latest: rates[rates.length - 1]
        };
    }

    return {
        chartData,
        stats
    };
};

/**
 * Lấy báo cáo lịch sử chatbot
 * @param {string} userId - ID của user
 * @param {object} query - Query parameters
 * @returns {object} - Dữ liệu báo cáo
 */
const getChatbotReport = async (userId, query) => {
    // Xác định khoảng thời gian
    const endDate = query.endDate ? new Date(query.endDate) : new Date();
    const startDate = query.startDate
        ? new Date(query.startDate)
        : new Date(endDate - 30 * 24 * 60 * 60 * 1000);

    // Thống kê theo category
    const categoryStats = await ChatHistory.aggregate([
        {
            $match: {
                userId: userId,
                createdAt: { $gte: startDate, $lte: endDate }
            }
        },
        {
            $group: {
                _id: '$category',
                count: { $sum: 1 }
            }
        },
        {
            $sort: { count: -1 }
        }
    ]);

    // Thống kê theo ngày
    const dailyStats = await ChatHistory.aggregate([
        {
            $match: {
                userId: userId,
                createdAt: { $gte: startDate, $lte: endDate }
            }
        },
        {
            $group: {
                _id: {
                    $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
                },
                count: { $sum: 1 }
            }
        },
        {
            $sort: { _id: 1 }
        }
    ]);

    // Tổng số câu hỏi
    const totalQuestions = await ChatHistory.countDocuments({
        userId,
        createdAt: { $gte: startDate, $lte: endDate }
    });

    // Các từ khóa phổ biến
    const keywordStats = await ChatHistory.aggregate([
        {
            $match: {
                userId: userId,
                createdAt: { $gte: startDate, $lte: endDate }
            }
        },
        { $unwind: '$detectedKeywords' },
        {
            $group: {
                _id: '$detectedKeywords',
                count: { $sum: 1 }
            }
        },
        { $sort: { count: -1 } },
        { $limit: 10 }
    ]);

    return {
        summary: {
            totalQuestions,
            dateRange: {
                start: startDate,
                end: endDate
            }
        },
        categoryStats: categoryStats.map(item => ({
            category: item._id,
            count: item.count
        })),
        dailyStats: dailyStats.map(item => ({
            date: item._id,
            count: item.count
        })),
        topKeywords: keywordStats.map(item => ({
            keyword: item._id,
            count: item.count
        }))
    };
};

/**
 * Lấy báo cáo tổng quan
 * @param {string} userId - ID của user
 * @returns {object} - Dữ liệu tổng quan
 */
const getDashboardReport = async (userId) => {
    // Lấy bản ghi sức khỏe mới nhất
    const latestHealthRecord = await HealthRecord.findOne({ userId })
        .sort({ createdAt: -1 });

    // Đếm tổng số bản ghi
    const totalHealthRecords = await HealthRecord.countDocuments({ userId });

    // Đếm tổng số câu hỏi chatbot
    const totalChatQuestions = await ChatHistory.countDocuments({ userId });

    // Lấy 5 câu hỏi gần nhất
    const recentChats = await ChatHistory.find({ userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('question category createdAt');

    return {
        healthSummary: {
            latestRecord: latestHealthRecord,
            totalRecords: totalHealthRecords
        },
        chatSummary: {
            totalQuestions: totalChatQuestions,
            recentChats
        }
    };
};

/**
 * Lấy thống kê tổng thể cho admin (tất cả users)
 * @returns {object} - Thống kê tổng thể
 */
const getAdminStats = async () => {
    const User = require('../models/User');
    
    // Đếm tổng số bản ghi sức khỏe của tất cả users
    const totalHealthRecords = await HealthRecord.countDocuments();
    
    // Đếm tổng số câu hỏi chatbot của tất cả users
    const totalChatQuestions = await ChatHistory.countDocuments();
    
    // Đếm tổng số nhắc nhở đang hoạt động
    const totalActiveReminders = await Reminder.countDocuments({ isActive: true });
    
    // Thống kê Health Goals
    const totalHealthGoals = await HealthGoal.countDocuments();
    const activeHealthGoals = await HealthGoal.countDocuments({ status: 'active' });
    const completedHealthGoals = await HealthGoal.countDocuments({ status: 'completed' });
    
    // Thống kê Water Intake
    const totalWaterIntakes = await WaterIntake.countDocuments();
    const waterIntakeStats = await WaterIntake.aggregate([
        {
            $group: {
                _id: null,
                totalAmount: { $sum: '$amount' },
                averageAmount: { $avg: '$amount' }
            }
        }
    ]);
    const totalWaterAmount = waterIntakeStats.length > 0 ? waterIntakeStats[0].totalAmount : 0;
    
    // Thống kê Exercise Log
    const totalExercises = await ExerciseLog.countDocuments();
    const exerciseStats = await ExerciseLog.aggregate([
        {
            $group: {
                _id: null,
                totalDuration: { $sum: '$duration' },
                totalCalories: { $sum: { $ifNull: ['$caloriesBurned', 0] } },
                totalDistance: { $sum: { $ifNull: ['$distance', 0] } }
            }
        }
    ]);
    const exerciseSummary = exerciseStats.length > 0 ? {
        totalDuration: exerciseStats[0].totalDuration || 0,
        totalCalories: exerciseStats[0].totalCalories || 0,
        totalDistance: exerciseStats[0].totalDistance || 0
    } : { totalDuration: 0, totalCalories: 0, totalDistance: 0 };
    
    // Thống kê Sleep Tracker
    const totalSleeps = await SleepTracker.countDocuments();
    const sleepStats = await SleepTracker.aggregate([
        {
            $group: {
                _id: null,
                totalSleepMinutes: { $sum: { $ifNull: ['$totalSleepMinutes', 0] } },
                averageSleepMinutes: { $avg: { $ifNull: ['$totalSleepMinutes', 0] } },
                count: { $sum: 1 }
            }
        }
    ]);
    const averageSleepHours = sleepStats.length > 0 && sleepStats[0].count > 0
        ? (sleepStats[0].averageSleepMinutes / 60).toFixed(1)
        : 0;
    
    // Tính ngày bắt đầu (30 ngày trước)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 30);
    
    // Lấy dữ liệu tăng trưởng người dùng (30 ngày qua)
    const userGrowth = await User.aggregate([
        {
            $match: {
                createdAt: { $gte: startDate, $lte: endDate }
            }
        },
        {
            $group: {
                _id: {
                    $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
                },
                count: { $sum: 1 }
            }
        },
        {
            $sort: { _id: 1 }
        }
    ]);
    
    // Lấy dữ liệu hoạt động theo ngày (health records + chats)
    const dailyActivity = await HealthRecord.aggregate([
        {
            $match: {
                createdAt: { $gte: startDate, $lte: endDate }
            }
        },
        {
            $group: {
                _id: {
                    $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
                },
                healthRecords: { $sum: 1 }
            }
        },
        {
            $sort: { _id: 1 }
        }
    ]);
    
    const dailyChats = await ChatHistory.aggregate([
        {
            $match: {
                createdAt: { $gte: startDate, $lte: endDate }
            }
        },
        {
            $group: {
                _id: {
                    $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
                },
                chats: { $sum: 1 }
            }
        },
        {
            $sort: { _id: 1 }
        }
    ]);
    
    // Merge daily activity data
    const activityMap = new Map();
    dailyActivity.forEach(item => {
        activityMap.set(item._id, { date: item._id, healthRecords: item.healthRecords, chats: 0 });
    });
    dailyChats.forEach(item => {
        if (activityMap.has(item._id)) {
            activityMap.get(item._id).chats = item.chats;
        } else {
            activityMap.set(item._id, { date: item._id, healthRecords: 0, chats: item.chats });
        }
    });
    
    return {
        totalHealthRecords,
        totalChatQuestions,
        totalActiveReminders,
        // Thống kê Health Goals
        healthGoals: {
            total: totalHealthGoals,
            active: activeHealthGoals,
            completed: completedHealthGoals
        },
        // Thống kê Water Intake
        waterIntake: {
            totalRecords: totalWaterIntakes,
            totalAmount: totalWaterAmount, // ml
            totalLiters: (totalWaterAmount / 1000).toFixed(2) // L
        },
        // Thống kê Exercise Log
        exerciseLog: {
            totalRecords: totalExercises,
            totalDuration: exerciseSummary.totalDuration, // phút
            totalCalories: exerciseSummary.totalCalories,
            totalDistance: exerciseSummary.totalDistance // km
        },
        // Thống kê Sleep Tracker
        sleepTracker: {
            totalRecords: totalSleeps,
            averageSleepHours: parseFloat(averageSleepHours)
        },
        userGrowth: userGrowth.map(item => ({
            date: item._id,
            count: item.count
        })),
        dailyActivity: Array.from(activityMap.values()).sort((a, b) => a.date.localeCompare(b.date))
    };
};

module.exports = {
    getHealthReport,
    getChatbotReport,
    getDashboardReport,
    getAdminStats
};
