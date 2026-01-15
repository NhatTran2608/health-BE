/**
 * ===================================
 * ROUTES: HEALTH GOAL - MỤC TIÊU SỨC KHỎE
 * ===================================
 */

const express = require('express');
const router = express.Router();
const { healthGoalController } = require('../controllers');
const { protect } = require('../middlewares');

router.post('/', protect, healthGoalController.createGoal);
router.get('/', protect, healthGoalController.getGoals);
router.get('/:id', protect, healthGoalController.getGoalById);
router.put('/:id', protect, healthGoalController.updateGoal);
router.delete('/:id', protect, healthGoalController.deleteGoal);
router.put('/:id/progress', protect, healthGoalController.updateProgress);

module.exports = router;



