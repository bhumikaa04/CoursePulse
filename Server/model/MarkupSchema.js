const mongoose = require('mongoose');

const markupSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  documentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document', required: true },
  type: { type: String, enum: ['highlight', 'comment', 'drawing'], required: true },
  content: { type: String }, // For comments
  coordinates: {
    x: { type: Number },
    y: { type: Number },
    width: { type: Number },
    height: { type: Number },
    pageNumber: { type: Number }
  },
  style: {
    color: { type: String, default: '#FFFF00' },
    opacity: { type: Number, default: 0.5 }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Markup', markupSchema);