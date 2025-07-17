const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({  
    username: {
        type: String,
        unique : true ,
        required: true
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String,
    },
    age: {
        type: Number,
        min: 0,
    },
    bio: {
        type: String,
        default: 'No bio available'
    },
    profilePhoto: {
        type: String,
        default: '../authentication/public/profile_image.jpg'
    }, 
    followers: {
        type: Number,
        default: 0
    },
    following: {
        type: Number,
        default: 0
    },
    courseCreated: {
        type: Number,
        default: 0
    },
    coursePublished: {
        type: Number,
        default: 0
    },
    courseEnrolled: {
        type: Number,
        default: 0
    }
});

const profileModel = mongoose.model('ProfileUser', profileSchema);
module.exports = profileModel;
