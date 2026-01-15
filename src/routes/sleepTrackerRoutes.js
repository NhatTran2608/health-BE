/**
 * ===================================
 * ROUTES: SLEEP TRACKER - THEO DÕI GIẤC NGỦ
 * ===================================
 */

const express = require('express');
const router = express.Router();
const { sleepTrackerController } = require('../controllers');
const { protect } = require('../middlewares');

router.post('/', protect, sleepTrackerController.addSleep);
router.get('/', protect, sleepTrackerController.getSleeps);
router.get('/statistics', protect, sleepTrackerController.getStatistics);
router.get('/:id', protect, sleepTrackerController.getSleepById);
router.put('/:id', protect, sleepTrackerController.updateSleep);
router.delete('/:id', protect, sleepTrackerController.deleteSleep);

module.exports = router;



