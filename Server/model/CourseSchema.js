const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contentSchema = new Schema({
  title: { 
    type: String, 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['video', 'article', 'audio' , 'document'], 
    required: true 
  },
  url: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String 
  },
  thumbnail: { 
    type: String 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const courseSchema = new Schema({
  title: { 
    type: String, 
    required: true 
  },
  ownerEmail: { 
    type: String, 
    required: true 
  },  // Links to user's email
  contents: [contentSchema],  // Array of content subdocuments
  published: { 
    type: Boolean, 
    default: false 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now
  }
});

// Update the updatedAt field before saving
courseSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Course', courseSchema);