/**
 * ===================================
 * ROUTES: DOCTOR - QUẢN LÝ BÁC SĨ
 * ===================================
 */

const express = require('express');
const router = express.Router();
const { doctorController } = require('../controllers');
const { protect, adminOnly } = require('../middlewares');

// Public route - lấy danh sách bác sĩ sẵn sàng (cho user)
router.get('/available', doctorController.getAvailableDoctors);

// Admin routes
router.post('/', protect, adminOnly, doctorController.createDoctor);
router.get('/', protect, adminOnly, doctorController.getDoctors);
router.get('/:id', protect, doctorController.getDoctorById);
router.put('/:id', protect, adminOnly, doctorController.updateDoctor);
router.delete('/:id', protect, adminOnly, doctorController.deleteDoctor);

module.exports = router;

