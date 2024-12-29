const express = require('express');
const Notification = require('../models/Notification');
const router = express.Router();

// Get all notifications
router.get('/notifications', async (req, res) => {
    try {
        const notifications = await Notification.find();
        // Add full URL for sound files
        const notificationsWithUrls = notifications.map(notification => ({
            ...notification._doc,
            soundFile: `${req.protocol}://${req.get('host')}/sounds/${notification.soundFile}`
        }));
        res.json(notificationsWithUrls);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notifications', error });
    }
});

module.exports = router;
