const mongoose = require('mongoose');

const authSchema = new mongoose.Schema({  
    email: {
        type: String,
        required: true
    }, 
    username: {
        type: String,
        unique : true ,
        required: true
    },
    password: {
        type: String,
        required: true
    } 
}); 

const userModel = mongoose.model('AuthUser', authSchema);
module.exports = userModel;
