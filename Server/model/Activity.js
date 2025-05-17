const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    type: String, // e.g., 'viewed_course', 'completed_quiz'
    details: String,
}, { timestamps: true });

module.exports = mongoose.model('Activity', activitySchema);
