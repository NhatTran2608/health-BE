/**
 * ===================================
 * ROUTES: EXERCISE LOG - NHẬT KÝ TẬP LUYỆN
 * ===================================
 */

const express = require('express');
const router = express.Router();
const { exerciseLogController } = require('../controllers');
const { protect } = require('../middlewares');

router.post('/', protect, exerciseLogController.addExercise);
router.get('/', protect, exerciseLogController.getExercises);
router.get('/statistics', protect, exerciseLogController.getStatistics);
router.get('/:id', protect, exerciseLogController.getExerciseById);
router.put('/:id', protect, exerciseLogController.updateExercise);
router.delete('/:id', protect, exerciseLogController.deleteExercise);

module.exports = router;



