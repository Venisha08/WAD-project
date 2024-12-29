const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/sounds', express.static(path.join(__dirname, '../focusprime-frontend/assets/sounds')));

// Serve static files
app.use(express.static(path.join(__dirname, '../focusprime-frontend')));

// Define routes
// app.get('/home', (req, res) => {
//   res.sendFile(path.join(__dirname, '../focusprime-frontend/header.html'));
// });

// app.get('/settings', (req, res) => {
//   res.sendFile(path.join(__dirname, '../focusprime-frontend/settings.html'));
// });

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, '../focusprime-frontend/signup.html'));
});

// Import and use routes
const userRoutes = require('./routes/userRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const backgroundRoutes = require('./routes/backgroundRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const taskRoutes = require("./routes/taskRoutes");


app.use(express.json());

app.use('/api', userRoutes);
app.use('/api', taskRoutes);
app.use('/api', notificationRoutes);
app.use('/api', backgroundRoutes);
app.use('/api', settingsRoutes);

// MongoDB connection
const MONGO_URI ="mongodb://localhost:27017/focus";
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });

mongoose.connection.on('disconnected', () => {
  console.error('MongoDB connection lost');
});

// Centralized error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});




