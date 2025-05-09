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
const Router = express.Router;

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb+srv://itsbhumika04:itsbhumika04@cluster0.9iaylg7.mongodb.net/')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Connection error:', err));

// Define Express Router
const router = express.Router();

// Dashboard Route (Protected)

// Middleware: Ensure `req.user` is set correctly
function authenticationToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.sendStatus(401);
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user; // Attach decoded user (which includes email)
    next();
  });
}

// Route: Handle missing username
app.get('/dashboard', authenticationToken, (req, res) => {
  try {
    res.json({
      message: 'Welcome to the dashboard!',
      user: {
        email: req.user.email,
        username: req.user.username || req.user.email.split('@')[0] // Fallback
      }
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

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
      // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = await userModel.create({
            email,
            username,
            password: hashedPassword  // Store the hashed version
        });
        
        res.status(201).json(newUser);

      await newuser.save(); // Save the user to the database

      res.status(201).json({ message: "Registration successful" });
      console.log("User registered successfully:", newUser);
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
            console.log('User not found');
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

app.post('/create-course', async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).send(course);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.post('/create-course/save', authenticationToken, async (req, res) => {
  try {
    const { course } = req.body;

    // Validate course data
    if (!course || !course.title) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    let savedCourse;
    if (course._id) {
      // Check if the course exists and belongs to the user
      const existingCourse = await Course.findOne({ _id: course._id, ownerEmail: req.user.email });
      if (!existingCourse) {
        return res.status(404).json({ error: 'Course not found or unauthorized' });
      }

      // Update existing course
      savedCourse = await Course.findOneAndUpdate(
        { _id: course._id, ownerEmail: req.user.email },
        {
          $set: {
            title: course.title,
            contents: course.contents || [],
            updatedAt: new Date(),
          },
        },
        { new: true }
      );
    } else {
      // Create a new course
      const newCourse = new Course({
        title: course.title,
        ownerEmail: req.user.email,
        contents: course.contents || [],
        published: false,
      });
      savedCourse = await newCourse.save();
    }

    res.status(201).json(savedCourse);
  } catch (err) {
    console.error('Save error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


// router.get('/courses', authenticateToken, async (req, res) => {
//   try {
//     const courses = await Course.find({ ownerEmail: req.user.email });
//     res.json(courses);
//   } catch (err) {
//     console.error('Error fetching courses:', err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// Get user courses
app.get('/courses', authenticateToken, async (req, res) => {
  try {
    const courses = await Course.find({ ownerEmail: req.user.email });
    res.json(courses);
  } catch (err) {
    console.error('Error fetching courses:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Use the router in the Express app
app.use('/', router);
app.use('/create-course', router); 

// Start the server
app.listen(3001, () => {
    console.log('Server is running on port 3001');
});
