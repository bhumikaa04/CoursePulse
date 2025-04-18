const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      text: true, // Enables text search
    },
    description: {
      type: String,
      text: true, // Enables text search
    },
    instructor: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['web', 'design', 'business', 'data'], // Matches categories in the React component
    },
    difficulty: {
      type: String,
      required: true,
      enum: ['beginner', 'intermediate', 'advanced'],
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
    },
    reviews: {
      type: Number,
      default: 0,
    },
    imageUrl: {
      type: String,
      default: '/default-course.jpg', // Default image URL
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

// Indexes for search optimization
courseSchema.index({ title: 'text', description: 'text' }); // Full-text search for title and description

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
