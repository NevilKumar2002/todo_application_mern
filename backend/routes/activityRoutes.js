
const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');

// CRUD operations
router.get('/', activityController.getAllActivities);
router.post('/', activityController.addActivity);
router.get('/:id', activityController.getActivity);
router.put('/:id', activityController.updateActivity);
router.delete('/:id', activityController.deleteActivity);

// Activity actions
router.put('/:id/start', activityController.startActivity);
router.put('/:id/end', activityController.endActivity);
router.put('/:id/resume', activityController.resumeActivity);
router.put('/:id/pause', activityController.pauseActivity);

module.exports = router;
