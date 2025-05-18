const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const connectDB = require('./dbconnect');
const Profile = require('./model/ProfileSchema');
const Course = require('./model/CourseSchema');
const AuthUser =require('./model/users');
const bcrypt = require('bcryptjs');

// Load dummy data from file
const dummyDataPath = path.join(__dirname, 'dummy_data.json');
const dummyData = JSON.parse(fs.readFileSync(dummyDataPath, 'utf-8'));
MONGO_URI = 'mongodb+srv://itsbhumika04:itsbhumika04@cluster0.9iaylg7.mongodb.net/' ; 

async function loadData() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing collections (optional)
    await AuthUser.deleteMany({});
    await Profile.deleteMany({});
    await Course.deleteMany({});

    // Read your dummyData.json file
    const dataPath = path.join(__dirname, 'dummy_data.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const data = JSON.parse(rawData);

    const saltRounds = 10;

    // Insert users with hashed passwords
    for (const user of data.users) {
      const hashedPassword = await bcrypt.hash(user.password, saltRounds);
      await AuthUser.create({
        email: user.email,
        username: user.username,
        password: hashedPassword,
      });
    }
    console.log('Users inserted');

    // Insert profiles
    for (const profile of data.profiles) {
      await Profile.create(profile);
    }
    console.log('Profiles inserted');

    // Insert courses
    await Course.insertMany(data.courses);
    console.log('Courses inserted');

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB. Data loading complete!');
  } catch (err) {
    console.error('Error loading data:', err);
  }
}

loadData();
