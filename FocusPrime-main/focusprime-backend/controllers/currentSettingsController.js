const CurrentSettings = require('../models/CurrentSettings');

// Save or update current settings
exports.saveCurrentSettings = async (req, res) => {
    try {
        const { timers, notificationSound, theme } = req.body;

        // Find existing settings or create a new one
        let settings = await CurrentSettings.findOne();
        if (!settings) {
            settings = new CurrentSettings();
        }

        // Update fields if provided
        if (timers) {
            settings.timers = timers; // Expecting an object like { work, shortBreak, longBreak }
        }
        if (notificationSound) {
            settings.notificationSound = notificationSound;
        }
        if (theme) {
            settings.theme = theme; // Expecting a theme name or attributes
        }

        await settings.save();
        res.json({ message: 'Settings updated successfully', settings });
    } catch (error) {
        console.error('Error saving settings:', error);
        res.status(500).json({ message: 'Error saving settings', error });
    }
};

// Fetch current settings
exports.getCurrentSettings = async (req, res) => {
    try {
        const settings = await CurrentSettings.findOne();
        if (!settings) {
            return res.status(404).json({ message: 'No settings found' });
        }
        res.json(settings);
    } catch (error) {
        console.error('Error fetching settings:', error);
        res.status(500).json({ message: 'Error fetching settings', error });
    }
};
