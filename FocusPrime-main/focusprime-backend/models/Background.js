const mongoose = require('mongoose');

const backgroundSchema = new mongoose.Schema({
    name: { type: String, required: true },
    pointsToUnlock: { type: Number, required: true },
    previewColor: { type: String, required: true },
    taskTimerCountColor: { type: String, required: false },  // Make optional
    timerContainerColor: { type: String, required: false },  // Make optional
    textColor: { type: String, required: false },  // Make optional
    backgroundColor: { type: String, required: false }  // Make optional
});

module.exports = mongoose.model('Background', backgroundSchema);

