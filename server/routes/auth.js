const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const jwt_secret = "quickbrownfoxjumpsoverlazydog"

// Register route
router.post("/register", async (req, res) => {
  const { email, password, username } = req.body;
  

  try {
    var existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });
    var existingUser = await User.findOne({ username });
    if (existingUser)
      return res.status(400).json({ message: "Username already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword, username });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, username: username }, jwt_secret, {
      expiresIn: "1h",
    });
    res.status(200).json({
       token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: "Token is missing" });
  }

  try {
    // Decode and verify the token
    const secretKey = jwt_secret; // Replace with your actual secret key
    const decoded = jwt.verify(token, secretKey);

    // Attach user details to the request object
    req.user = decoded.username;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

router.get("/profile" , authMiddleware,  (req,res) => {
  
  res.json({
    username: req.user
  })
})

module.exports = router;