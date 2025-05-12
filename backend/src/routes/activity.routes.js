const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const activityController = require('../controllers/activity.controller');

// Get recent activities
router.get('/recent', auth, activityController.getRecentActivities);

// Get activities for a specific entity
router.get('/:entityType/:entityId', auth, activityController.getEntityActivities);

// Create a new activity (internal use only)
router.post('/', auth, activityController.createActivity);

module.exports = router;