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
// app.get('/dashboard', authenticationToken, (req, res) => {

//   try {
//     // Fetch the user data from database
//     const user = await userModel.findOne({ email: req.user.email });
    
//     if (!user) {
//       console.log('User not found in database');
//       return res.status(404).json({ error: "User not found" });
//     }
    
//     // Log the user data
//     console.log('User data from database:', user);
//   try {
//     res.json({
//       message: 'Welcome to the dashboard!',
//       user: {
//         email: req.user.email,
//         username: req.user.username || req.user.email.split('@')[0] // Fallback
//       }
//     });

//   } catch (err) {
//     console.error("Dashboard error:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// });


app.get('/dashboard', authenticationToken, async (req, res) => {
  try {
    // Fetch the user data from database
    const user = await userModel.findOne({ email: req.user.email });
    
    if (!user) {
      console.log('User not found in database');
      return res.status(404).json({ error: "User not found" });
    }
    
    // Log the user data
    // console.log('User data from database:', user);
    
    res.json({
      message: 'Welcome to the dashboard!',
      user: {
        email: user.email,
        username: user.username || user.email.split('@')[0]
      }
    });
    // res.status(201).json(savedCourse);
  } catch (err) {
    console.error("Dashboard error:", err);
    res.setHeader('Content-Type', 'application/json');
    res.status(500).json({ error: "Server error" });
  }
});

const createUserProfile = async (username) => {
    try {
        const newProfile = new profileModel({
            username: username,
            firstName: "Default",
            bio: "This is a default bio."
        });
        await newProfile.save();
        console.log("Profile created successfully!");
    } catch (err) {
        console.error("Error creating profile:", err);
    }
};

// Registration Route

router.post('/register', async (req, res) => {
    const { email, username, password, firstName, lastName, age, bio } = req.body;

    // Validate required fields
    if (!email || !username || !password) {
        return res.status(400).json({ message: "Email, username, and password are required!" });
    }

    try {
        // Check if email or username already exists
        const existingUser = await userModel.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: "Email or username already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = new userModel({
            email,
            username,
            password: hashedPassword,
        });
        await newUser.save();

        // Create profile (with default values for missing fields)
        const newProfile = new profileModel({
            username,
            firstName: firstName || "",
            lastName: lastName || "",
            age: age || 0,
            bio: bio || "",
            profilePhoto: "https://i.imgur.com/default-profile.jpg",
            followers: 0,
            following: 0,
            courseCreated: 0,
            coursePublished: 0,
            courseEnrolled: 0
        });
        await newProfile.save();

        // Generate JWT token
        const token = jwt.sign(
            { userId: newUser._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(201).json({ 
            message: "User registered successfully", 
            user: newUser,
            token: token 
        });

        await createUserProfile(username);
        console.log('User profile created:', newProfile);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email });
        console.log('User found:', user);
        if (!user) {
            console.log('User not found');
            return res.status(401).json({ message: "Invalid email entered" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }


        const profile = await profileModel.findOne({ username: user.username });
        console.log('Profile found:', profile);
        if (!profile) {
          console.log("Profile not found for user:", user._id);
          return res.status(404).json({ message: "User profile not found" });
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }, 
        );

        // Send response with token and user details
        res.json({
            token,
            isLoggedIn: true,
            message: "Login successful" , 
            username: user.username,
            email: user.email,
            user: {
                username: user.username,
                email: user.email,
                //...profile._doc // Spread operator to include profile fields
            }
        });

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

// Route to fetch the profile by username
router.get('/profile/:username', async (req, res) => {
    const { username } = req.params;
    console.log('Fetching profile for username:', username);

    try {
        // Find the profile by the username in the database
        const profile = await profileModel.findOne({ username });

        // If no profile is found, return 404
        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        // If profile is found, return the profile data
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
    // Log the entire request body first
    console.log('Full request body:', req.body);
    
    const { course } = req.body;

    // Detailed logging of the course data
    console.log('Received course data:', {
      title: course?.title,
      hasContents: !!course?.contents,
      contentsLength: course?.contents?.length || 0,
      isUpdate: !!course?._id,
      ownerEmail: req.user.email // From auth token
    });

    // Validate course data exists
    if (!course) {
      console.error('No course data received');
      return res.status(400).json({ error: 'Missing course data' });
    }

    // Validate required fields
    if (!course.title) {
      console.error('Missing title in course data:', course);
      return res.status(400).json({ error: 'Missing required title field' });
    }

    // Log contents if they exist
    if (course.contents && course.contents.length > 0) {
      console.log('Contents received:');
      course.contents.forEach((content, index) => {
        console.log(`Content ${index + 1}:`, {
          title: content.title,
          type: content.type,
          url: content.url,
          description: content.description?.length || 'No description',
          thumbnail: content.thumbnail ? 'Has thumbnail' : 'No thumbnail'
        });
      });
    } else {
      console.log('No contents received or empty contents array');
    }

    let savedCourse;
    if (course._id) {
      console.log('Processing course update for ID:', course._id);
      
      const existingCourse = await Course.findOne({ _id: course._id, ownerEmail: req.user.email });
      if (!existingCourse) {
        console.error('Course not found or unauthorized:', {
          requestedId: course._id,
          ownerEmail: req.user.email
        });
        return res.status(404).json({ error: 'Course not found or unauthorized' });
      }

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
      console.log('Course updated:', savedCourse);
    } else {
      console.log('Creating new course');
      const newCourse = new Course({
        title: course.title,
        ownerEmail: req.user.email,
        contents: course.contents || [],
        published: false,
      });
      savedCourse = await newCourse.save();
      console.log('New course created:', savedCourse);
    }

    res.status(201).json(savedCourse);
  } catch (err) {
    console.error('Save error:', {
      error: err.message,
      stack: err.stack,
      requestBody: req.body
    });
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user courses
app.get('/courses', authenticateToken, async (req, res) => {
  try {
    console.log('Fetching courses for user:', req.user.email);
    const courses = await Course.find({ ownerEmail: req.user.email });
    console.log('Courses fetched for user:', req.user.email, courses);
   return res.json(courses);
  } catch (err) {
    console.error('Error fetching courses:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

//document upload
// In your backend (e.g., Express.js)
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/documents');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Upload endpoint
router.post('/upload-document', authenticateToken, upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/documents/${req.file.filename}`;

    res.json({
      success: true,
      fileUrl,
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      fileSize: req.file.size
    });
  } catch (error) {
    console.error('Document upload error:', error);
    res.status(500).json({ error: 'Failed to upload document' });
  }
});

// Use the router in the Express app
app.use('/', router);
app.use('/create-course', router); 

// Start the server
app.listen(3001, () => {
    console.log('Server is running on port 3001');
});
