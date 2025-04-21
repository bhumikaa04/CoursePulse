const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userModel = require('./model/users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authenticateToken = require('./authMiddleware');
require('dotenv').config();
const Course = require('./model/CourseSchema'); 
const profileModel = require('./model/ProfileSchema');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/CoursePulse')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Connection error:', err));

// const mongoURI = process.env.MONGO_URI || 'your-atlas-connection-string-here';

// mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('Connected to MongoDB Atlas'))
//   .catch(err => console.error('Connection error:', err));


// Define Express Router
const router = express.Router();

// Dashboard Route (Protected)
app.get('/dashboard', authenticateToken, (req, res) => {
    res.json({ message: 'Welcome to the dashboard!', user: req.user });
});

// Register Route
// router.post('/register', async (req, res) => {
//     const { email, password , username } = req.body;

//     if (!email || !password || !username) {
//         return res.status(400).json({ message: "All fields are required" });
//     }
//     if (password.length < 6) {
//         return res.status(400).json({ message: "Password must be at least 6 characters long" });
//     }
//     if (!email.includes('@')) {
//         return res.status(400).json({ message: "Invalid email format" });
//     }
//     if (!username) {
//         return res.status(400).json({ message: "Username is required" });
//     }
//     if (username.length < 3) {
//         return res.status(400).json({ message: "Username must be at least 3 characters long" });
//     }

//     try {
//         // Check if the user already exists
//         const existingUser = await userModel.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ message: "User already exists" });
//         }

//         // Hash the password before saving
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);

//         // Create a new user
//         const user = new userModel({ email, username, password: hashedPassword });
//         await user.save();

//         // Generate JWT token
//         const token = jwt.sign(
//             { userId: user._id, email: user.email, username: user.username },
//             process.env.JWT_SECRET,
//             { expiresIn: process.env.JWT_EXPIRES_IN }
//         );

//         res.status(201).json({ token });
//     } catch (err) {
//         console.error("error in register route : " + err);
//         res.status(500).json({ message: "Server error" });
//     }
// });

router.post('/register', async (req, res) => {
  try {
      const { email, password, username } = req.body;

      // Basic validation
      if (!email || !password || !username) {
          return res.status(400).json({ message: "All fields are required" });
      }

      // Additional validation (e.g., password length, email format, etc.)
      if (password.length < 6) {
          return res.status(400).json({ message: "Password must be at least 6 characters long" });
      }
      if (!email.includes('@')) {
          return res.status(400).json({ message: "Invalid email format" });
      }
      if (username.length < 3) {
          return res.status(400).json({ message: "Username must be at least 3 characters long" });
      }

      // Check for duplicate username or email
      const user = new userModel({ email, username, password });

      await user.save(); // Save the user to the database

      res.status(201).json({ message: "Registration successful" });
      console.log("User registered successfully:", user);
  } catch (err) {
      console.error("Error in register route:", err);

      if (err.code === 11000) {
          // Handle duplicate key error
          const duplicateField = Object.keys(err.keyValue)[0]; // Get the field causing the error
          return res.status(400).json({
              message: `The ${duplicateField} "${err.keyValue[duplicateField]}" is already taken.`,
          });
      }

      res.status(500).json({ message: "Server error. Please try again later." });
  }
});


// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email entered" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
        );

        res.json({ token , isLoggedIn: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});


// Autocomplete suggestions
router.get('/suggestions', async (req, res) => {
    try {
      const { q } = req.query;
      if (!q) return res.json([]);
      
      const suggestions = await Course.aggregate([
        {
          $search: {
            index: 'autocomplete',
            autocomplete: {
              query: q,
              path: 'title',
              fuzzy: {
                maxEdits: 1
              }
            }
          }
        },
        { $limit: 5 },
        { $project: { title: 1, _id: 0 } }
      ]);
      
      res.json(suggestions.map(s => s.title));
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Full search with filters
  router.get('/search', async (req, res) => {
    try {
      const { q, category, difficulty } = req.query;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      
      const query = {};
      
      if (q) {
        query.$text = { $search: q };
      }
      
      if (category && category !== 'all') {
        query.category = category;
      }
      
      if (difficulty && difficulty !== 'all') {
        query.difficulty = difficulty;
      }
      
      const courses = await Course.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ rating: -1, createdAt: -1 });
        
      const total = await Course.countDocuments(query);
      
      res.json({
        data: courses,
        meta: {
          total,
          page,
          pages: Math.ceil(total / limit),
          limit
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });

// Get user profile by username
router.get('/profile/:username', async (req, res) => {
  const { username } = req.params;

  try {
      const profile = await profileModel.findOne({ username });
      if (!profile) {
          return res.status(404).json({ message: "Profile not found" });
      }
      res.json(profile);
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
  }
});

// Use the router in the Express app
app.use('/', router);

// Start the server
app.listen(3001, () => {
    console.log('Server is running on port 3001');
});
