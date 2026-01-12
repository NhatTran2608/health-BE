/**
 * ===================================
 * INDEX FILE CHO MIDDLEWARES
 * ===================================
 * File này export tất cả middlewares để dễ import
 */

const { protect, adminOnly } = require('./auth');
const { errorHandler, notFound } = require('./errorHandler');
const validator = require('./validator');

module.exports = {
    protect,
    adminOnly,
    errorHandler,
    notFound,
    ...validator
};
