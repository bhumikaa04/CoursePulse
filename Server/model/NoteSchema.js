const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  courseId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Course', 
    required: true 
  },
  contentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Content' 
  }, // Optional - for content-specific notes
  content: { 
    type: String, 
    required: true 
  },
  tags: [{ 
    type: String 
  }], // For organizing notes
  isHighlight: { 
    type: Boolean, 
    default: false 
  }, // For distinguishing highlights from regular notes
  position: { 
    type: Number 
  }, // For ordering notes
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  },
  metadata: {
    type: Map,
    of: String
  } // For any additional data like color, font style, etc.
});

module.exports = mongoose.model('Note', noteSchema);