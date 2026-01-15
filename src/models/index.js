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
const HealthGoal = require('./HealthGoal');
const WaterIntake = require('./WaterIntake');
const ExerciseLog = require('./ExerciseLog');
const SleepTracker = require('./SleepTracker');
const Doctor = require('./Doctor');
const Appointment = require('./Appointment');

module.exports = {
    User,
    HealthRecord,
    ChatHistory,
    Reminder,
    HealthGoal,
    WaterIntake,
    ExerciseLog,
    SleepTracker,
    Doctor,
    Appointment
};
