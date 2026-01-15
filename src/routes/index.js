/**
 * ===================================
 * INDEX FILE CHO ROUTES
 * ===================================
 * File này tổng hợp và export tất cả routes
 */

const express = require('express');
const router = express.Router();

// Import các routes
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const healthRecordRoutes = require('./healthRecordRoutes');
const chatbotRoutes = require('./chatbotRoutes');
const reminderRoutes = require('./reminderRoutes');
const reportRoutes = require('./reportRoutes');
const searchRoutes = require('./searchRoutes');
const healthGoalRoutes = require('./healthGoalRoutes');
const waterIntakeRoutes = require('./waterIntakeRoutes');
const exerciseLogRoutes = require('./exerciseLogRoutes');
const sleepTrackerRoutes = require('./sleepTrackerRoutes');
const doctorRoutes = require('./doctorRoutes');
const appointmentRoutes = require('./appointmentRoutes');

// Đăng ký các routes với prefix
router.use('/auth', authRoutes);           // /api/auth/*
router.use('/users', userRoutes);          // /api/users/*
router.use('/health-records', healthRecordRoutes); // /api/health-records/*
router.use('/chatbot', chatbotRoutes);     // /api/chatbot/*
router.use('/reminders', reminderRoutes);  // /api/reminders/*
router.use('/reports', reportRoutes);      // /api/reports/*
router.use('/search', searchRoutes);       // /api/search/*
router.use('/health-goals', healthGoalRoutes); // /api/health-goals/*
router.use('/water-intake', waterIntakeRoutes); // /api/water-intake/*
router.use('/exercise-log', exerciseLogRoutes); // /api/exercise-log/*
router.use('/sleep-tracker', sleepTrackerRoutes); // /api/sleep-tracker/*
router.use('/doctors', doctorRoutes); // /api/doctors/*
router.use('/appointments', appointmentRoutes); // /api/appointments/*

// Route test API
router.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'API Health Management System đang hoạt động!',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            users: '/api/users',
            healthRecords: '/api/health-records',
            chatbot: '/api/chatbot',
            reminders: '/api/reminders',
            reports: '/api/reports',
            search: '/api/search',
            healthGoals: '/api/health-goals',
            waterIntake: '/api/water-intake',
            exerciseLog: '/api/exercise-log',
            sleepTracker: '/api/sleep-tracker',
            doctors: '/api/doctors',
            appointments: '/api/appointments'
        }
    });
});

module.exports = router;
