/**
 * ===================================
 * ROUTES: WATER INTAKE - THEO DÕI LƯỢNG NƯỚC UỐNG
 * ===================================
 */

const express = require('express');
const router = express.Router();
const { waterIntakeController } = require('../controllers');
const { protect } = require('../middlewares');

router.post('/', protect, waterIntakeController.addIntake);
router.get('/', protect, waterIntakeController.getIntakes);
router.get('/daily', protect, waterIntakeController.getDailyTotal);
router.get('/statistics', protect, waterIntakeController.getStatistics);
router.delete('/:id', protect, waterIntakeController.deleteIntake);

module.exports = router;



