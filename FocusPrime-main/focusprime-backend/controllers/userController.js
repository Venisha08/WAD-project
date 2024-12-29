const User = require('../models/User');
const bcrypt = require('bcrypt');

// Function to register a new user
const registerUser = async (req, res) => {
  // Logic for registering user, hashing password, saving to DB
  try {
    const { username, email, password } = req.body;

    // Check if all fields are provided
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the new user
    const newUser = new User({
        username,
        email,
        password_hash: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
} catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
}
};

// Function to log in a user
const loginUser = async (req, res) => {
  // Logic for verifying user credentials and responding
  try {
    const { email, password } = req.body;

    // Check if all fields are provided
    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Find the user in the database
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare the passwords
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Login successful
    res.status(200).json({ message: 'Login successful' });
} catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
}
};

module.exports = { registerUser, loginUser };
