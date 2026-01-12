/**
 * ===================================
 * INDEX FILE CHO SERVICES
 * ===================================
 * File này export tất cả services để dễ import
 */

const authService = require('./authService');
const userService = require('./userService');
const healthRecordService = require('./healthRecordService');
const chatbotService = require('./chatbotService');
const reminderService = require('./reminderService');
const reportService = require('./reportService');
const searchService = require('./searchService');

module.exports = {
    authService,
    userService,
    healthRecordService,
    chatbotService,
    reminderService,
    reportService,
    searchService
};
