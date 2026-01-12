/**
 * ===================================
 * UTILITY: RESPONSE HELPER
 * ===================================
 * Các hàm tiện ích để tạo response thống nhất
 */

/**
 * Tạo response thành công
 * @param {Response} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Thông báo
 * @param {any} data - Dữ liệu trả về
 */
const successResponse = (res, statusCode = 200, message = 'Thành công', data = null) => {
    const response = {
        success: true,
        message
    };

    if (data !== null) {
        response.data = data;
    }

    return res.status(statusCode).json(response);
};

/**
 * Tạo response lỗi
 * @param {Response} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Thông báo lỗi
 */
const errorResponse = (res, statusCode = 500, message = 'Lỗi server') => {
    return res.status(statusCode).json({
        success: false,
        message
    });
};

/**
 * Tạo response với phân trang
 * @param {Response} res - Express response object
 * @param {any} data - Dữ liệu trả về
 * @param {object} pagination - Thông tin phân trang
 */
const paginatedResponse = (res, data, pagination) => {
    return res.status(200).json({
        success: true,
        message: 'Thành công',
        data,
        pagination: {
            currentPage: pagination.page,
            totalPages: Math.ceil(pagination.total / pagination.limit),
            totalItems: pagination.total,
            itemsPerPage: pagination.limit
        }
    });
};

module.exports = {
    successResponse,
    errorResponse,
    paginatedResponse
};
