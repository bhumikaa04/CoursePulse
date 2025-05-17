const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    courseId: mongoose.Schema.Types.ObjectId,
    percentage: Number,
}, { timestamps: true });

module.exports = mongoose.model('Progress', progressSchema);
