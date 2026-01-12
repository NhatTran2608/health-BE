/**
 * ===================================
 * CONTROLLER: HEALTH RECORD - HỒ SƠ SỨC KHỎE
 * ===================================
 * Controller này nhận request và trả response cho các API hồ sơ sức khỏe
 */

const healthRecordService = require('../services/healthRecordService');
const { successResponse, paginatedResponse } = require('../utils/responseHelper');

/**
 * @desc    Tạo bản ghi sức khỏe mới
 * @route   POST /api/health-records
 * @access  Private
 * 
 * @example Request body:
 * {
 *   "height": 170,
 *   "weight": 65,
 *   "bloodPressure": {
 *     "systolic": 120,
 *     "diastolic": 80
 *   },
 *   "heartRate": 75,
 *   "bloodSugar": 95,
 *   "temperature": 36.5,
 *   "note": "Sức khỏe bình thường"
 * }
 * 
 * @example Response:
 * {
 *   "success": true,
 *   "message": "Tạo bản ghi sức khỏe thành công",
 *   "data": {
 *     "record": { ... },
 *     "analysis": {
 *       "bmi": { "bmi": 22.5, "status": "normal", "advice": "..." },
 *       "bloodPressure": { ... },
 *       "warnings": []
 *     }
 *   }
 * }
 */
const createRecord = async (req, res, next) => {
    try {
        const result = await healthRecordService.createRecord(req.user._id, req.body);
        return successResponse(res, 201, 'Tạo bản ghi sức khỏe thành công', result);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Lấy danh sách bản ghi sức khỏe
 * @route   GET /api/health-records
 * @access  Private
 * 
 * @example Query: ?page=1&limit=10&startDate=2024-01-01&endDate=2024-12-31
 * 
 * @example Response:
 * {
 *   "success": true,
 *   "data": [ ... records ... ],
 *   "pagination": {
 *     "currentPage": 1,
 *     "totalPages": 5,
 *     "totalItems": 50,
 *     "itemsPerPage": 10
 *   }
 * }
 */
const getRecords = async (req, res, next) => {
    try {
        const { records, pagination } = await healthRecordService.getRecords(
            req.user._id,
            req.query
        );
        return paginatedResponse(res, records, pagination);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Lấy một bản ghi sức khỏe theo ID
 * @route   GET /api/health-records/:id
 * @access  Private
 */
const getRecordById = async (req, res, next) => {
    try {
        const result = await healthRecordService.getRecordById(
            req.params.id,
            req.user._id
        );
        return successResponse(res, 200, 'Thành công', result);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Cập nhật bản ghi sức khỏe
 * @route   PUT /api/health-records/:id
 * @access  Private
 * 
 * @example Request body: (các trường cần cập nhật)
 * {
 *   "weight": 66,
 *   "note": "Đã tăng 1kg"
 * }
 */
const updateRecord = async (req, res, next) => {
    try {
        const result = await healthRecordService.updateRecord(
            req.params.id,
            req.user._id,
            req.body
        );
        return successResponse(res, 200, 'Cập nhật bản ghi thành công', result);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Xóa bản ghi sức khỏe
 * @route   DELETE /api/health-records/:id
 * @access  Private
 */
const deleteRecord = async (req, res, next) => {
    try {
        await healthRecordService.deleteRecord(req.params.id, req.user._id);
        return successResponse(res, 200, 'Xóa bản ghi thành công');
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Lấy bản ghi sức khỏe mới nhất
 * @route   GET /api/health-records/latest
 * @access  Private
 */
const getLatestRecord = async (req, res, next) => {
    try {
        const result = await healthRecordService.getLatestRecord(req.user._id);

        if (!result) {
            return successResponse(res, 200, 'Chưa có bản ghi sức khỏe nào', null);
        }

        return successResponse(res, 200, 'Thành công', result);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createRecord,
    getRecords,
    getRecordById,
    updateRecord,
    deleteRecord,
    getLatestRecord
};
