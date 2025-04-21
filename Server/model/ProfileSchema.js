const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({  
    username: {
        type: String,
        unique : true ,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    middleName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    age: {
        type: Number,
        required: true
    },
    bio: {
        type: String,
        required: true
    },
    profilePhoto: {
        type: String,
        default: 'https://example.com/default-profile-photo.jpg'
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
