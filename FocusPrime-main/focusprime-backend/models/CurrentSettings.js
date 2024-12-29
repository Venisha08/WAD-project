const mongoose = require('mongoose');

const currentSettingsSchema = new mongoose.Schema({
    timers: {
        workTimer: { type: Number, required: true }, // in minutes
        breakTimer: { type: Number, required: true },
        longBreakTimer: { type: Number, required: true },
    },
    notification: { type: String, required: true }, // Name of the sound file
    theme: {
        name: { type: String, required: true }, // e.g., 'Sky'
        backgroundColor: { type: String, required: true }, // e.g., '#ADD8E6'
        textColor: { type: String, required: true },       // e.g., '#00008B'
        timerContainerColor: { type: String, required: true }, // e.g., 'linear-gradient(...)'
    },
});

module.exports = mongoose.model('CurrentSettings', currentSettingsSchema);
