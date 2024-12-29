const express = require('express');
const Background = require('../models/Background');
const router = express.Router();

// Get all background themes
router.get('/backgrounds', async (req, res) => {
    try {
        const backgrounds = await Background.find();
        res.json(backgrounds);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching backgrounds', error });
    }
});

module.exports = router;
