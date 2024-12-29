const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    pointsToUnlock: { type: Number, required: true },
    soundFile: { type: String, required: true },
});

module.exports = mongoose.model('Notification', notificationSchema);
