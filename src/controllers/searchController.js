/**
 * ===================================
 * CONTROLLER: SEARCH - TÌM KIẾM
 * ===================================
 * Controller này nhận request và trả response cho các API tìm kiếm
 */

const searchService = require('../services/searchService');
const { successResponse, paginatedResponse } = require('../utils/responseHelper');

/**
 * @desc    Tìm kiếm tổng hợp
 * @route   GET /api/search
 * @access  Private
 * 
 * @example Query: ?keyword=stress&page=1&limit=20&type=all
 * 
 * @example Response:
 * {
 *   "success": true,
 *   "data": {
 *     "results": {
 *       "chats": [...],
 *       "healthRecords": [...]
 *     },
 *     "pagination": { ... }
 *   }
 * }
 */
const search = async (req, res, next) => {
    try {
        const { keyword } = req.query;

        // Kiểm tra từ khóa
        if (!keyword || keyword.trim() === '') {
            return successResponse(res, 200, 'Vui lòng nhập từ khóa tìm kiếm', {
                results: { chats: [], healthRecords: [] },
                pagination: { page: 1, limit: 20, total: 0 }
            });
        }

        const result = await searchService.search(req.user._id, keyword, req.query);
        return successResponse(res, 200, 'Thành công', result);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Tìm kiếm lịch sử chat
 * @route   GET /api/search/chats
 * @access  Private
 * 
 * @example Query: ?keyword=ngủ&page=1&limit=20
 */
const searchChats = async (req, res, next) => {
    try {
        const { keyword } = req.query;

        if (!keyword || keyword.trim() === '') {
            return successResponse(res, 200, 'Vui lòng nhập từ khóa tìm kiếm', {
                results: [],
                pagination: { page: 1, limit: 20, total: 0 }
            });
        }

        const { results, pagination } = await searchService.searchChats(
            req.user._id,
            keyword,
            req.query
        );
        return paginatedResponse(res, results, pagination);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    search,
    searchChats
};
