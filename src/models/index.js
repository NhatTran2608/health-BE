/**
 * ===================================
 * INDEX FILE CHO MODELS
 * ===================================
 * File này export tất cả models để dễ import
 */

const User = require('./User');
const HealthRecord = require('./HealthRecord');
const ChatHistory = require('./ChatHistory');
const Reminder = require('./Reminder');

module.exports = {
    User,
    HealthRecord,
    ChatHistory,
    Reminder
};
