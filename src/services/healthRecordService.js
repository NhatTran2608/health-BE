/**
 * ===================================
 * SERVICE: HEALTH RECORD - HỒ SƠ SỨC KHỎE
 * ===================================
 * Service này xử lý logic nghiệp vụ liên quan đến hồ sơ sức khỏe:
 * - Thêm bản ghi sức khỏe
 * - Cập nhật bản ghi
 * - Xóa bản ghi
 * - Lấy danh sách bản ghi
 */

const HealthRecord = require('../models/HealthRecord');
const { analyzeHealthData } = require('../utils/healthChecker');

/**
 * Tạo bản ghi sức khỏe mới
 * @param {string} userId - ID của user
 * @param {object} recordData - Dữ liệu bản ghi sức khỏe
 * @returns {object} - Bản ghi mới và phân tích sức khỏe
 */
const createRecord = async (userId, recordData) => {
    // Tạo bản ghi mới
    const record = await HealthRecord.create({
        userId,
        ...recordData
    });

    // Phân tích chỉ số sức khỏe
    const healthAnalysis = analyzeHealthData(recordData);

    return {
        record,
        analysis: healthAnalysis
    };
};

/**
 * Lấy tất cả bản ghi sức khỏe của user
 * @param {string} userId - ID của user
 * @param {object} query - Query parameters (page, limit, startDate, endDate)
 * @returns {object} - Danh sách bản ghi và phân trang
 */
const getRecords = async (userId, query) => {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    // Xây dựng filter
    const filter = { userId };

    // Lọc theo ngày nếu có
    if (query.startDate || query.endDate) {
        filter.createdAt = {};
        if (query.startDate) {
            filter.createdAt.$gte = new Date(query.startDate);
        }
        if (query.endDate) {
            filter.createdAt.$lte = new Date(query.endDate);
        }
    }

    // Query database
    const records = await HealthRecord.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }); // Mới nhất lên đầu

    const total = await HealthRecord.countDocuments(filter);

    return {
        records,
        pagination: {
            page,
            limit,
            total
        }
    };
};

/**
 * Lấy một bản ghi sức khỏe theo ID
 * @param {string} recordId - ID của bản ghi
 * @param {string} userId - ID của user (để kiểm tra quyền)
 * @returns {object} - Bản ghi sức khỏe
 */
const getRecordById = async (recordId, userId) => {
    const record = await HealthRecord.findOne({
        _id: recordId,
        userId
    });

    if (!record) {
        const error = new Error('Không tìm thấy bản ghi sức khỏe');
        error.statusCode = 404;
        throw error;
    }

    // Phân tích chỉ số sức khỏe
    const healthAnalysis = analyzeHealthData(record);

    return {
        record,
        analysis: healthAnalysis
    };
};

/**
 * Cập nhật bản ghi sức khỏe
 * @param {string} recordId - ID của bản ghi
 * @param {string} userId - ID của user
 * @param {object} updateData - Dữ liệu cập nhật
 * @returns {object} - Bản ghi đã cập nhật
 */
const updateRecord = async (recordId, userId, updateData) => {
    // Tìm và cập nhật, chỉ cho phép cập nhật bản ghi của chính mình
    const record = await HealthRecord.findOneAndUpdate(
        { _id: recordId, userId },
        updateData,
        { new: true, runValidators: true }
    );

    if (!record) {
        const error = new Error('Không tìm thấy bản ghi sức khỏe');
        error.statusCode = 404;
        throw error;
    }

    // Phân tích chỉ số sức khỏe mới
    const healthAnalysis = analyzeHealthData(record);

    return {
        record,
        analysis: healthAnalysis
    };
};

/**
 * Xóa bản ghi sức khỏe
 * @param {string} recordId - ID của bản ghi
 * @param {string} userId - ID của user
 * @returns {boolean} - Thành công hay không
 */
const deleteRecord = async (recordId, userId) => {
    const record = await HealthRecord.findOneAndDelete({
        _id: recordId,
        userId
    });

    if (!record) {
        const error = new Error('Không tìm thấy bản ghi sức khỏe');
        error.statusCode = 404;
        throw error;
    }

    return true;
};

/**
 * Lấy bản ghi sức khỏe mới nhất của user
 * @param {string} userId - ID của user
 * @returns {object} - Bản ghi mới nhất
 */
const getLatestRecord = async (userId) => {
    const record = await HealthRecord.findOne({ userId })
        .sort({ createdAt: -1 });

    if (!record) {
        return null;
    }

    const healthAnalysis = analyzeHealthData(record);

    return {
        record,
        analysis: healthAnalysis
    };
};

module.exports = {
    createRecord,
    getRecords,
    getRecordById,
    updateRecord,
    deleteRecord,
    getLatestRecord
};
