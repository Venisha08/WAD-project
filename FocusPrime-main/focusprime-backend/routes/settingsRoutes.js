const express = require('express');
const Notification = require('../models/Notification'); // Notification Model
const BackgroundTheme = require('../models/Background'); // Background Theme Model
const CurrentSettings = require('../models/CurrentSettings'); // Current Settings Model
const router = express.Router();

// Fetch notifications
router.get('/notifications', async (req, res) => {
    try {
        const notifications = await Notification.find();
        res.status(200).json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: 'Failed to fetch notifications' });
    }
});

// Fetch background themes
router.get('/backgrounds', async (req, res) => {
    try {
        const themes = await BackgroundTheme.find();
        res.status(200).json(themes);
    } catch (error) {
        console.error('Error fetching themes:', error);
        res.status(500).json({ message: 'Failed to fetch themes' });
    }
});

// Save or update current settings
router.post('/currentsettings', async (req, res) => {
    const { timers, notification, theme } = req.body;

    try {
        const settings = await CurrentSettings.findOneAndUpdate(
            {}, // Single settings document for simplicity
            { timers, notification, theme },
            { upsert: true, new: true } // Create if not exists, return updated doc
        );
        res.status(200).json({ message: 'Settings saved successfully', settings });
    } catch (error) {
        console.error('Error saving settings:', error);
        res.status(500).json({ message: 'Failed to save settings', error });
    }
});

// Fetch current settings
router.get('/currentsettings', async (req, res) => {
    try {
        const settings = await CurrentSettings.findOne();
        res.status(200).json(settings || {});
    } catch (error) {
        console.error('Error fetching current settings:', error);
        res.status(500).json({ message: 'Failed to fetch current settings', error });
    }
});

module.exports = router;
