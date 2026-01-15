/**
 * ===================================
 * ROUTES: APPOINTMENT - QUẢN LÝ LỊCH HẸN
 * ===================================
 */

const express = require('express');
const router = express.Router();
const { appointmentController } = require('../controllers');
const { protect, adminOnly } = require('../middlewares');

// User routes
router.post('/', protect, appointmentController.createAppointment);
router.get('/my-appointments', protect, appointmentController.getUserAppointments);
router.get('/my-appointments/:id', protect, appointmentController.getAppointmentById);
router.put('/my-appointments/:id/cancel', protect, appointmentController.cancelAppointment);

// Admin routes
router.get('/', protect, adminOnly, appointmentController.getAllAppointments);
router.get('/:id', protect, adminOnly, appointmentController.getAppointmentById);
router.put('/:id/status', protect, adminOnly, appointmentController.updateAppointmentStatus);

module.exports = router;

