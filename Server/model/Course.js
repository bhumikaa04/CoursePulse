const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: String,
    description: String,
    thumbnailUrl: String,
    rating: Number,
});

module.exports = mongoose.model('Course', courseSchema);
