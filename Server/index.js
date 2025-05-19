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
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bodyParser = require("body-parser");

const app = express();
app.use(express.json());
app.use(cors());


app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

app.use('/uploads/images', express.static(path.join(__dirname, 'uploads/images')));

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
            profilePhoto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkBgwHNkzJDKiKXU6EiDIHIIvUR7YnO0SqGw&s",
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
        // console.log('Profile found:', profile);

        if (!profile) {
          console.log("Profile not found for user:", user._id);
          return res.status(404).json({ message: "User profile not found" });
        }

        const token = jwt.sign(
            { 
              userId: user._id, 
              email: user.email, 
              username: user.username
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }, 
        );

        // Send response with token and user details
        res.json({
            token,
            isLoggedIn: true,
            message: "Login successful" , 
            user, 
            profile
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
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

const profilePhotoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/images');
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

const uploadProfilePhoto = multer({ 
  storage: profilePhotoStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  }
});

app.post('/upload-profile-photo/:username', uploadProfilePhoto.single('profilePhoto'), async (req, res) => {
  const { username } = req.params;

  try {
    if (req.file) {
      const imagePath = `/uploads/images/${req.file.filename}`;
      const profile = await profileModel.findOneAndUpdate(
        { username },
        { profilePhoto: imagePath },
        { new: true }
      );

      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }

      res.status(200).json({ message: "Profile photo updated", profile });
    } else {
      res.status(400).json({ error: "No file uploaded" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

app.patch('/edit-profile/:username', async (req, res) => {
  const { username } = req.params;
  const updatedData = req.body;

  try {
    const profile = await profileModel.findOneAndUpdate(
      { username },
      updatedData,
      { new: true, runValidators: true }
    );

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

app.put("/edit-profile/:username", uploadProfilePhoto.single('profilePhoto'), async (req, res) => {
  const { username } = req.params;
  const updatedData = req.body;

  try {
    if (req.file) {
      updatedData.profilePhoto = `/uploads/images/${req.file.filename}`;

      const oldProfile = await profileModel.findOne({ username });
      if (oldProfile && oldProfile.profilePhoto &&
          !oldProfile.profilePhoto.includes('default-profile-image.jpg')) {
        const oldPhotoPath = path.join(__dirname, '..', oldProfile.profilePhoto);
        if (fs.existsSync(oldPhotoPath)) {
          fs.unlinkSync(oldPhotoPath);
        }
      }
    }

    const profile = await profileModel.findOneAndUpdate(
      { username },
      updatedData,
      { new: true, runValidators: true }
    );

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message || "Internal server error" });
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

// app.post('/create-course/save', authenticationToken, async (req, res) => {
//   try {
//     // Log the entire request body first
//     console.log('Full request body:', req.body);
//     const { course } = req.body;

//     // Detailed logging of the course data
//     console.log('Received course data:', {
//       title: course?.title,
//       hasContents: !!course?.contents,
//       contentsLength: course?.contents?.length || 0,
//       isUpdate: !!course?._id,
//       ownerEmail: req.user.email // From auth token
//     });

//     // Validate course data exists
//     if (!course) {
//       console.error('No course data received');
//       return res.status(400).json({ error: 'Missing course data' });
//     }

//     // Validate required fields
//     if (!course.title) {
//       console.error('Missing title in course data:', course);
//       return res.status(400).json({ error: 'Missing required title field' });
//     }

//     // Log contents if they exist
//     if (course.contents && course.contents.length > 0) {
//       console.log('Contents received:');
//       course.contents.forEach((content, index) => {
//         console.log(`Content ${index + 1}:`, {
//           title: content.title,
//           type: content.type,
//           url: content.url,
//           description: content.description?.length || 'No description',
//           thumbnail: content.thumbnail ? 'Has thumbnail' : 'No thumbnail'
//         });
//       });
//     } else {
//       console.log('No contents received or empty contents array');
//     }

//     let savedCourse;
//     let isNewCourse = false;

//     if (course._id) {
//       console.log('Processing course update for ID:', course._id);
      
//       const existingCourse = await Course.findOne({ _id: course._id, ownerEmail: req.user.email });
//       if (!existingCourse) {
//         console.error('Course not found or unauthorized:', {
//           requestedId: course._id,
//           ownerEmail: req.user.email
//         });
//         return res.status(404).json({ error: 'Course not found or unauthorized' });
//       }

//       savedCourse = await Course.findOneAndUpdate(
//         { _id: course._id, ownerEmail: req.user.email },
//         {
//           $set: {
//             title: course.title,
//             contents: course.contents || [],
//             updatedAt: new Date(),
//           },
//         },
//         { new: true }
//       );
//       console.log('Course updated:', savedCourse);
//     } else {
//       console.log('Creating new course');
//       const newCourse = new Course({
//         title: course.title,
//         ownerEmail: req.user.email,
//         contents: course.contents || [],
//         published: false,
//       });
//       savedCourse = await newCourse.save();
//       isNewCourse = true;
//       console.log('New course created:', savedCourse);

//       // Increment courseCreated count for the user
//       await User.updateOne(
//         { email: req.user.email },
//         { $inc: { courseCreated: 1 } }
//       );
//       console.log('User course count incremented');
//     }

//     res.status(201).json(savedCourse);
//   } catch (err) {
//     console.error('Save error:', {
//       error: err.message,
//       stack: err.stack,
//       requestBody: req.body
//     });
//     res.status(500).json({ error: 'Server error' });
//   }
// });

app.post('/create-course/save', authenticationToken, async (req, res) => {
  try {
    // Log the entire request body
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
    let isNewCourse = false;

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
      isNewCourse = true;
      console.log('New course created:', savedCourse);

    const updatedUser = await profileModel.findOne({ email: req.user.email });
    console.log('Updated user profile:', updatedUser);
    res.status(201).json({ course: savedCourse, user: updatedUser });

    // Increment courseCreated count for the user
      console.log('Incrementing courseCreated for user:', req.user.email);
      const userUpdateResult = await profileModel.updateOne(
        { username: req.user.username },
        { $inc: { courseCreated: 1 } }
      );
      console.log('User update result:', userUpdateResult);
    }
  } catch (err) {
    console.error('Save error:', {
      error: err.message,
      stack: err.stack,
      requestBody: req.body
    });
    res.status(500).json({ error: 'Server error' });
  }
});


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

// Dummy data for progress
const progressData = {
  7: { completedTasks: 5, totalTasks: 10, progressPercent: 50 },
  30: { completedTasks: 20, totalTasks: 40, progressPercent: 50 },
};

// Endpoint: /progress?days=7
app.get("/progress", (req, res) => {
  const days = req.query.days || "7"; // default to 7 days if not provided
  const data = progressData[days] || progressData["7"];
  res.json({
    days,
    data,
  });
});

// Endpoint: /recent-activities
app.get("/recent-activities", (req, res) => {
  // Example list of recent activities
  const activities = [
    { id: 1, activity: "Completed chapter 3 of Data Structures", date: "2025-05-15" },
    { id: 2, activity: "Solved 5 coding problems", date: "2025-05-14" },
    { id: 3, activity: "Watched React tutorial video", date: "2025-05-13" },
  ];
  res.json({ activities });
});

// Endpoint: /recommended-courses
app.get("/recommended-courses", (req, res) => {
  // Example recommended courses
  const courses = [
    { id: 101, title: "Introduction to Data Science", provider: "Coursera" },
    { id: 102, title: "React for Beginners", provider: "Udemy" },
    { id: 103, title: "Advanced Algorithms", provider: "edX" },
  ];
  res.json({ courses });
});

// app.get('/search', async (req, res) => {
//   const { q } = req.query;

//   if (!q) {
//     return res.json({ courses: [], profiles: [] });
//   }

//   try {
//     const courses = await Course.find({ title: { $regex: q, $options: 'i' } });
//     const profiles = await User.find({ username: { $regex: q, $options: 'i' } });

//     res.json({ courses, profiles });
//   } catch (err) {
//     res.status(500).send({ message: 'Error fetching search results.' });
//   }
// });

// app.get('/search', async (req, res) => {
//   const { q } = req.query;

//   if (!q) {
//     return res.json({ courses: [], profiles: [] });
//   }

//   try {
//     const courses = await Course.find({ title: { $regex: q, $options: 'i' } });
//     const profiles = await User.find({ username: { $regex: q, $options: 'i' } });

//     return res.json({ courses, profiles });
//   } catch (err) {
//     console.error('Error fetching search results:', err.message); // Log error to the server console
//     res.status(500).json({ message: 'Error fetching search results.' });
//   }
// });

router.get('/search', async (req, res) => {
  try {

    console.log('q : ', req.query); 
    const { q } = req.query;

    if (!q || q.trim() === '') {
      return res.status(200).json({
        courses: [],
        profiles: []
      });
    }

    // Perform search in collections
    const profiles = await profileModel.find({
      username: { $regex: q, $options: 'i' }
    }).limit(10);

    const courses = await Course.find({
      title: { $regex: q, $options: 'i' }
    }).limit(10);

    console.log('profiles : ' , profiles) ;
    console.log('courses : ' , courses); 

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ profiles, courses });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      message: 'An error occurred during search',
      error: error.message
    });
  }
});


router.get("/my-created-courses", authenticateToken, async (req, res) => {
  try {
    // Get the authenticated user's email from the token
    const userEmail = req.user.email; 
    
    // Find only courses where ownerEmail matches the logged-in user's email
    const userCourses = await Course.find({ ownerEmail: userEmail })
      .select('-__v') // Exclude version key
      .sort({ createdAt: -1 }); // Sort by newest first

    if (!userCourses || userCourses.length === 0) {
      return res.status(200).json({ 
        message: "You haven't created any courses yet",
        courses: [] 
      });
    }

    res.status(200).json({ 
      success: true,
      count: userCourses.length,
      courses: userCourses 
    });

  } catch (error) {
    console.error("Error fetching user courses:", error);
    res.status(500).json({ 
      success: false,
      error: "Failed to fetch your courses" 
    });
  }
});

// Route to fetch created and enrolled courses for a user
router.get("/my-courses", authenticateToken , async (req, res) => {
  try {
    const userEmail = req.user.email; // Extract the email from the authenticated user
    const userProfile = await profileModel.findOne({ username: req.user.username });

    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    // Fetch courses created by the user
    const createdCourses = await Course.find({ ownerEmail: userEmail });

    // Fetch courses where the user is enrolled
    const enrolledCourses = await Course.find({ "contents.ownerEmail": userEmail });

    res.status(200).json({
      createdCourses,
      enrolledCourses,
    });
  } catch (err) {
    console.error("Error fetching courses:", err);
    res.status(500).json({ message: "Failed to fetch courses" });
  }
});

// Use the router in the Express app
app.use('/', router);
app.use('/create-course', router); 

// Start the server
app.listen(3001, () => {
    console.log('Server is running on port 3001');
});
