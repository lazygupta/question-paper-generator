const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const User = require('../models/User');
const Notes = require('../models/notes');

const jwt_secret = "jackiechan"

router.post("/signin", async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await Admin.findOne({ username });
        if (user) {
            if (user?.isAdmin === false) return res.status(404).json({ message: "You are not an admin" });

            const isMatch = password === user?.password
            if (!isMatch)
                return res.status(400).json({ message: "Invalid credentials" });

            const token = jwt.sign({ id: user._id, username: username }, jwt_secret, {
                expiresIn: "1h",
            });

            res.status(200).json({
                token
            });
        } else {
            return res.status(404).json({ message: "No admin is regsitered with this username" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

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

router.get("/users",authMiddleware, async (req, res) => {
    try {
      const users = await User.find(); // Get all users from the database
      res.status(200).json({ users });
    } catch (error) {
      res.status(500).json({ message: "Error fetching users", error: error.message });
    }
  });

  // Fetch all subjects
router.get('/subjects', async (req, res) => {
  try {
      // Fetch distinct subjects from the Notes model
      const subjects = await Notes.distinct('subject');
      res.status(200).json({ subjects });
  } catch (error) {
      console.error("Error fetching subjects:", error.message);
      res.status(500).json({ message: "An error occurred while fetching subjects." });
  }
});

router.delete('/subjects/:subjectName', authMiddleware, async (req, res) => {
  const { subjectName } = req.params;

  try {
      // Delete all records matching the subject name
      const deleted = await Notes.deleteMany({ subject: { $regex: `^${subjectName}$`, $options: 'i' } });


      if (deleted.deletedCount > 0) {
          res.status(200).json({ message: "Subject deleted successfully" });
      } else {
          res.status(404).json({ message: "Subject not found" });
      }
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});


  // Admin route to delete a user by ID
router.delete("/users/:id",authMiddleware, async (req, res) => {
    const userId = req.params.id; // Get the user ID from the URL parameter
  
    try {
      // Check if the user exists
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Perform the deletion
      await User.findByIdAndDelete(userId);
  
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting user", error: error.message });
    }
  });
  

module.exports = router;