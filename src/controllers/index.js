/**
 * ===================================
 * INDEX FILE CHO CONTROLLERS
 * ===================================
 * File này export tất cả controllers để dễ import
 */

const authController = require('./authController');
const userController = require('./userController');
const healthRecordController = require('./healthRecordController');
const chatbotController = require('./chatbotController');
const reminderController = require('./reminderController');
const reportController = require('./reportController');
const searchController = require('./searchController');
const healthGoalController = require('./healthGoalController');
const waterIntakeController = require('./waterIntakeController');
const exerciseLogController = require('./exerciseLogController');
const sleepTrackerController = require('./sleepTrackerController');
const doctorController = require('./doctorController');
const appointmentController = require('./appointmentController');

module.exports = {
    authController,
    userController,
    healthRecordController,
    chatbotController,
    reminderController,
    reportController,
    searchController,
    healthGoalController,
    waterIntakeController,
    exerciseLogController,
    sleepTrackerController,
    doctorController,
    appointmentController
};
