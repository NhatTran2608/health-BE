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

// Đăng ký các routes với prefix
router.use('/auth', authRoutes);           // /api/auth/*
router.use('/users', userRoutes);          // /api/users/*
router.use('/health-records', healthRecordRoutes); // /api/health-records/*
router.use('/chatbot', chatbotRoutes);     // /api/chatbot/*
router.use('/reminders', reminderRoutes);  // /api/reminders/*
router.use('/reports', reportRoutes);      // /api/reports/*
router.use('/search', searchRoutes);       // /api/search/*

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
            search: '/api/search'
        }
    });
});

module.exports = router;
