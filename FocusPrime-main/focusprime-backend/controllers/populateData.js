const mongoose = require('mongoose');
const Notification = require('../models/Notification');  // Corrected path
const Background = require('../models/Background');  // Corrected path
const dotenv = require('dotenv');
const path = require('path');  // Import the path module

dotenv.config({ path: path.resolve(__dirname, '../.env') }); // Ensure .env is loaded from root directory

// MongoDB connection string
const MONGO_URI = "mongodb://localhost:27017/focus";

if (!MONGO_URI) {
  console.error('MONGO_URI is not defined in the .env file.');
  process.exit(1);
}

// Connect to MongoDB
mongoose.connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Connection failed', err));

// Sample data
const notifications = [
    { name: 'Chime', pointsToUnlock: 5, soundFile: 'chime.mp3' },
    { name: 'Bell', pointsToUnlock: 10, soundFile: 'bell.mp3' },
    { name: 'Wind Chime', pointsToUnlock: 15, soundFile: 'wind_chime.mp3' },
    { name: 'Beep', pointsToUnlock: 20, soundFile: 'beep.mp3' },
    { name: 'Ding', pointsToUnlock: 25, soundFile: 'ding.mp3' },
    { name: 'Alert', pointsToUnlock: 30, soundFile: 'alert.mp3' },
    { name: 'Ping', pointsToUnlock: 35, soundFile: 'ping.mp3' },
    { name: 'Notification', pointsToUnlock: 40, soundFile: 'notification.mp3' },
    { name: 'Tone', pointsToUnlock: 45, soundFile: 'tone.mp3' },
    { name: 'Whistle', pointsToUnlock: 50, soundFile: 'whistle.mp3' },
];

const backgrounds = [
    { 
        name: 'Light', 
        pointsToUnlock: 0, 
        previewColor: '#FFFFFF',
        taskTimerCountColor: '#000000',  // Add missing fields
        timerContainerColor: '#FFFFFF',
        textColor: '#000000',
        backgroundColor: '#FFFFFF'
    },
    { 
        name: 'Dark', 
        pointsToUnlock: 0, 
        previewColor: '#000000',
        taskTimerCountColor: '#FFFFFF',
        timerContainerColor: '#000000',
        textColor: '#FFFFFF',
        backgroundColor: '#000000'
    },
    { 
        name: 'Forest', 
        pointsToUnlock: 20, 
        previewColor: '#228B22',
        taskTimerCountColor: '#000000',
        timerContainerColor: '#228B22',
        textColor: '#FFFFFF',
        backgroundColor: '#228B22'
    },
    { 
        name: 'Ocean', 
        pointsToUnlock: 25, 
        previewColor: '#1E90FF',
        taskTimerCountColor: '#FFFFFF',
        timerContainerColor: '#1E90FF',
        textColor: '#FFFFFF',
        backgroundColor: '#1E90FF'
    },
    { 
        name: 'Sunset', 
        pointsToUnlock: 30, 
        previewColor: '#FF4500',
        taskTimerCountColor: '#000000',
        timerContainerColor: '#FF4500',
        textColor: '#FFFFFF',
        backgroundColor: '#FF4500'
    },
    { 
        name: 'Mountain', 
        pointsToUnlock: 35, 
        previewColor: '#8B4513',
        taskTimerCountColor: '#FFFFFF',
        timerContainerColor: '#8B4513',
        textColor: '#FFFFFF',
        backgroundColor: '#8B4513'
    },
    { 
        name: 'Galaxy', 
        pointsToUnlock: 40, 
        previewColor: '#4B0082',
        taskTimerCountColor: '#FFFFFF',
        timerContainerColor: '#4B0082',
        textColor: '#FFFFFF',
        backgroundColor: '#4B0082'
    },
    { 
        name: 'Desert', 
        pointsToUnlock: 45, 
        previewColor: '#DAA520',
        taskTimerCountColor: '#000000',
        timerContainerColor: '#DAA520',
        textColor: '#000000',
        backgroundColor: '#DAA520'
    },
    { 
        name: 'Snow', 
        pointsToUnlock: 50, 
        previewColor: '#ADD8E6',
        taskTimerCountColor: '#000000',
        timerContainerColor: '#ADD8E6',
        textColor: '#000000',
        backgroundColor: '#ADD8E6'
    },
    { 
        name: 'Floral', 
        pointsToUnlock: 55, 
        previewColor: '#FF69B4',
        taskTimerCountColor: '#FFFFFF',
        timerContainerColor: '#FF69B4',
        textColor: '#000000',
        backgroundColor: '#FF69B4'
    }
];


// Function to populate data
const populateData = async () => {
    try {
        // Clear existing data
        await Notification.deleteMany({});
        await Background.deleteMany({});

        // Insert new data
        await Notification.insertMany(notifications);
        console.log('Notifications inserted successfully.');

        await Background.insertMany(backgrounds);
        console.log('Backgrounds inserted successfully.');

        mongoose.connection.close();
    } catch (err) {
        console.error('Error populating data:', err);
        mongoose.connection.close();
    }
};

// Run the script
populateData();
