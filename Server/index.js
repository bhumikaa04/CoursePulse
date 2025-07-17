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
const { isShallowEqualArray } = require('framer/render/utils/isShallowEqualArray.js');
const noteController = require('./controllers/noteController')
const markupRoute = require('./Routes/markup.js');

const app = express();
app.use(express.json());
app.use(cors());


app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/uploads/images', express.static(path.join(__dirname, '../uploads/images')));
app.use('/uploads/documents', express.static(path.join(__dirname, '../uploads/documents')));
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
app.use('/pdf-workers', express.static(path.join(__dirname, 'public', 'pdf-workers')));

app.use('/uploads/documents', express.static(path.join(__dirname, '../uploads/documents')));
app.use('/uploads/thumbnails', express.static(path.join(__dirname, '../uploads/thumbnails')));
app.use('/uploads/images', express.static(path.join(__dirname, '../uploads/images')));
app.use('/uploads/videos', express.static(path.join(__dirname, '../uploads/videos')));
app.use('/uploads/audio', express.static(path.join(__dirname, '../uploads/audio')));


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

    console.log('profiles in backend: ' , profiles) ;
    console.log('courses in backend : ' , courses); 

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

//Route to fetch the course page
router.get("/course" , authenticateToken , async(req, res) => {
  try{
    //extracting the email
    const userEmail = req.user.email ;  
    const username = req.user.username;
    //extract the profile Model for the user
    const userProfile = await profileModel.findOne({ username: req.user.username}); 

    //fetch the created courses by the user 
    const createdCourses = await Course.find({ownerEmail : userEmail}); 
    console.log(createdCourses); 
    //console.log("courses : " , createdCourses); 

    //fetch the courses enrolled by the user 
    const enrolledCourses = await Course.find({"contents.ownerEmail" : userEmail }); 

    //sending the response
    res.status(200).json({
      user: userProfile,
      createdCourses, 
      enrolledCourses, 
    }); 
  }catch (err){
    console.log("error fetching the courses!"); 
    console.error("error : " , err); 
    res.status(500).json({message : "Courses not found!"}); 
  }
}); 

//Route to create a new Course
router.post('/course/addCourse' , authenticateToken , async(req, res) => {
  const { title, ownerEmail , username } = req.body;
  try{
    if (!title || !ownerEmail) {
      return res.status(400).json({ message: 'Title and owner email are required.' });
    }

    // Create a new Course instance
    const newCourse = new Course({
      title,
      ownerEmail,
      createdAt : new Date(), 
      updatedAt : new Date(),
    });

    // Save the new course to the database
    await newCourse.save();

    const profile = await profileModel.findOneAndUpdate(
      { username: username },
      { $push: { coursesCreated: newCourse._id } }, 
    )

    // Send a success response with the created course data
    res.status(201).json({
      message: 'Course created successfully!',
      course: newCourse, 
    });

  } catch (error) {
    console.error('Error creating course:', error);
    // Handle Mongoose validation errors specifically
    if (error.name === 'ValidationError') {
      const errors = Object.keys(error.errors).map(key => error.errors[key].message);
      return res.status(400).json({ message: 'Validation failed', errors });
    }
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
})

//Route to get the courseInfo
router.get('/course/:id/:title?' , authenticateToken , async(req, res) => {
  const courseId = req.params.id ; 
  const courseTitle = req.params.title ; 
  //console.log("Hitting GET /course/:id/:title for courseId:", courseId , courseTitle);

  try{
    const course = await Course.findOne({ _id : courseId , ownerEmail : req.user.email }); 

    if(!course){
      console.log("Course not found or unauthorized for GET request:", courseId);
      return res.status(404).json({ error: "Course not found or unauthorized." });
    }
    console.log("Successfully fetched course:", courseId);
    res.status(200).json(course); 
  }catch(err){
    console.error('Error fetching course:', err);
    return res.status(500).json({err : "server error while fetching the course"})
  }
})

//Route to publish the courses 
router.post('/course/:id/publish' , authenticateToken , async(req , res) => {
  const courseId = req.params.id ; 

  try{
    //find the course
    const course = await Course.findOne({ _id : courseId , ownerEmail : req.user.email}); 

    //condition if not found 
    if(!course){
      return res.status(200).json({error : "Course not found or authorized"}); 
    }
    //update the values 
    const updatedCourse = await Course.findOneAndUpdate(
      {_id : courseId} , 
      {
        published : !course.published, 
        updatedAt : new Date()
      } , 
      {new : true}, 
    );
    //send the new response 
    return res.status(200).json({
      course : updatedCourse , 
      message : updatedCourse.published 
        ? "Course published successfully" 
        : "Course unpublished successfully"
  }); 
  }catch(err){
    console.error('Error publishing course:', err);
    res.status(500).json({ error: "Server error while publishing course" });
  }
}); 

//Route to delete the course 
router.delete('/course/:id/delete' , authenticateToken , async(req , res) => {
  //courseID 
  const courseId = req.params.id ; 
  //find and delete 
  try{
    const result = await Course.findOneAndDelete({
      _id : courseId , 
      ownerEmail : req.user.email 
    })

    const profile = await profileModel.findOneAndUpdate(
      {_id : courseId } , 
      { $inc :{ courseCreated : -1}},
      {new : true} 
    )

    if(!result){
      console.log("Course not found or unauthorized for deletion:", courseId);
      return res.status(404).json({ error: "Course not found or unauthorized for deletion." });
    }

    //send success message
    console.log("Course successfully deleted:", courseId);

    res.status(200).json({ 
      message: "Course deleted successfully!", 
      deletedCourseId: courseId
    });
  }catch(err){
    console.error('Error deleting course:', err);
    res.status(500).json({ error: "Server error while deleting course." });
  }
  
}); 

//Route to save the courses
router.post('/course/:id/save' , authenticateToken , async(req, res) => {
  const courseId = req.params.id ;
  const {course} = req.body ;

  if(!course){
    console.log("Error: No course data in request body.");
    return res.status(404).json({error : "Error fetching the course."}) // This error message is a bit misleading if 'course' is just missing from the body. "Missing course data in request body" might be clearer.
  }

  try{
      console.log("Attempting to find course with _id:", courseId, "and ownerEmail:", req.user.email);
      const existingCourse = await Course.findOne({ _id : courseId , ownerEmail : req.user.email});
      if(!existingCourse){
        console.log("Course not found or unauthorized for courseId:", courseId, "and ownerEmail:", req.user.email);
        return res.status(404).json({error : "Course not found or unauthorized"});
      }

      //update the course fields
      existingCourse.title  = course.title || existingCourse.title ;
      existingCourse.description= course.description || existingCourse.description ;
      existingCourse.updatedAt = new Date();

      const updatedCourse = await existingCourse.save();
      console.log("Course successfully saved. Updated course:", updatedCourse);
      res.status(200).json({course : updatedCourse});
  }catch(err){
    console.error('Error saving course:', err);
    res.status(500).json({ error: "Server error while saving course." });
  }
})

// Create a single storage configuration that handles both content and thumbnails
const combinedStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadDir;
    
    if (file.fieldname === 'thumbnail') {
      uploadDir = path.join(__dirname, '../uploads/thumbnails');
    } else {
      const type = req.body?.type || 'document';
      uploadDir = path.join(__dirname, `../uploads/${type}s`);
    }
    
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

// File filter configuration (same as before)
const fileFilter = (req, file, cb) => {
  const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
  const validDocumentTypes = ['application/pdf', 'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  const validVideoTypes = ['video/mp4', 'video/webm', 'video/ogg'];
  const validAudioTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg'];

  if (file.fieldname === 'thumbnail') {
    if (!validImageTypes.includes(file.mimetype)) {
      return cb(new Error('Only images (JPEG, PNG, GIF) are allowed for thumbnails'));
    }
    return cb(null, true);
  }

  if (file.fieldname === 'file') {
    const contentType = req.body?.type || 'document';
    
    switch(contentType) {
      case 'image':
        if (!validImageTypes.includes(file.mimetype)) {
          return cb(new Error('Only images are allowed for image content'));
        }
        break;
      case 'document':
        if (!validDocumentTypes.includes(file.mimetype)) {
          return cb(new Error('Only PDF or Word documents are allowed'));
        }
        break;
      case 'video':
        if (!validVideoTypes.includes(file.mimetype)) {
          return cb(new Error('Only MP4, WebM or Ogg videos are allowed'));
        }
        break;
      case 'audio':
        if (!validAudioTypes.includes(file.mimetype)) {
          return cb(new Error('Only MP3, WAV or Ogg audio files are allowed'));
        }
        break;
      default:
        return cb(new Error('Invalid content type specified'));
    }
    return cb(null, true);
  }

  cb(new Error('Unexpected file field'));
};

// Fixed route handler
router.post('/course/:id/addContent',
  authenticateToken,
  (req, res, next) => {
    const upload = multer({
      storage: combinedStorage, // Use the single combined storage
      fileFilter: fileFilter,
      limits: { fileSize: 100 * 1024 * 1024 } // 100MB max
    }).fields([
      { name: 'file', maxCount: 1 },
      { name: 'thumbnail', maxCount: 1 }
    ]);
    
    upload(req, res, (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  },
  async (req, res) => {
    try {
      const { title, type, description, url, inputMethod } = req.body;
      const courseId = req.params.id;

      // Validate course ownership
      const course = await Course.findOne({ _id: courseId, ownerEmail: req.user.email });
      if (!course) {
        return res.status(404).json({ error: 'Course not found or unauthorized' });
      }

      let contentPath;
      let thumbnailPath;

      // Handle content path
      if (inputMethod === 'file') {
        if (!req.files?.file?.[0]) {
          return res.status(400).json({ error: 'No file uploaded' });
        }
        contentPath = `/uploads/${type}s/${req.files.file[0].filename}`;
      } else {
        if (!url || !isValidUrl(url)) {
          return res.status(400).json({ error: 'Valid URL required' });
        }
        contentPath = url;
      }

      // Handle thumbnail
      if (req.files?.thumbnail?.[0]) {
        thumbnailPath = `/uploads/thumbnails/${req.files.thumbnail[0].filename}`;
      } else if (type === 'video' && inputMethod === 'url' && url.includes('youtube.com')) {
        // Auto-generate YouTube thumbnail
        const videoId = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)?.[1];
        thumbnailPath = `http://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
      }

      // Create content object
      const newContent = {
        title,
        type,
        description,
        url: contentPath,
        thumbnail: thumbnailPath,
        createdAt: new Date(),
        order: course.contents.length
      };

      // Save to database
      course.contents.push(newContent);
      course.updatedAt = new Date();
      await course.save();

      res.status(201).json({
        message: 'Content added successfully!',
        content: newContent
      });

    } catch (err) {
      console.error('Error adding content:', err);
      
      // Cleanup uploaded files if error occurred
      if (req.files) {
        Object.values(req.files).forEach(files => {
          files.forEach(file => {
            fs.unlink(file.path, () => {});
          });
        });
      }
      
      res.status(500).json({ 
        error: err.message || 'Failed to add content'
      });
    }
  }
);

//Route to delete content in the particular course 
router.delete('/course/:id/:contentIndex' , authenticateToken , async(req, res) => {
  try{
    const courseId = req.params.id; 
    const contentIndex = parseInt(req.params.contentIndex); 
    //finding the course 
    const course = await Course.findOne({ _id: courseId, ownerEmail: req.user.email });
    //check authorization 
    if(!course){
      return res.status(404).json({error : "Course not found or unathorized."}); 
    }
    //check validity of contentIndex
    if(contentIndex < 0 || contentIndex >= course.contents.length){
      return res.status(400).json({error : "Invalid value of Content Index"}); 
    }

    //removing the content 
    course.contents.splice(contentIndex , 1); 
    course.updatedAt = new Date(); 
    await course.save(); 

    return res.status(200).json({message : "Content Deleted Successfully!!"}); 
  }catch(err){
    console.error("Error deleting content:", err);
    res.status(500).json({ error: "Server error while deleting content" });
  }
}); 

//Route to edit content in a particular course 
// router.put(
//   '/course/:courseId/:contentId',
//   authenticateToken,
//   uploadFormData.fields([
//     { name: 'thumbnail', maxCount: 1 },
//     { name: 'document', maxCount: 1 }, // Only relevant for type=document
//   ]),
//   async (req, res) => {
//     try {
//       const { courseId, contentId } = req.params;
//       const { title, description, type, url, currentDocumentPath, currentThumbnailPath } = req.body;

//       const thumbnailFile = req.files['thumbnail']?.[0];
//       const documentFile = req.files['document']?.[0];

//       const course = await Course.findOne({ _id: courseId, ownerEmail: req.user.email });
//       if (!course) return res.status(404).json({ message: 'Course not found or unauthorized' });

//       const contentItem = course.contents.find(item => item._id.toString() === contentId);
//       if (!contentItem) return res.status(404).json({ message: 'Content item not found' });

//       // Update common fields
//       contentItem.title = title;
//       contentItem.description = description;
//       contentItem.type = type;
//       contentItem.updatedAt = new Date(); 

//       // Update thumbnail
//       if (thumbnailFile) {
//         contentItem.thumbnail = `/uploads/images/${thumbnailFile.filename}`;
//       } else if (currentThumbnailPath) {
//         contentItem.thumbnail = currentThumbnailPath;
//       }

//       // Update content url depending on type
//       if (type === 'document') {
//         if (documentFile) {
//           contentItem.url = `/uploads/documents/${documentFile.filename}`;
//         } else if (currentDocumentPath) {
//           contentItem.url = currentDocumentPath;
//         }
//       } else {
//         // For video, audio, link, article
//         contentItem.url = url || '';
//       }

//       await course.save();
//       res.status(200).json(contentItem);
//     } catch (err) {
//       console.error('Error updating content:', err);
//       res.status(500).json({ message: 'Internal server error' });
//     }
//   }
// );



app.use('/', router);
app.use('/api/markups', markupRoute);

// Start the server
app.listen(3001, () => {
    console.log('Server is running on port 3001');
});
