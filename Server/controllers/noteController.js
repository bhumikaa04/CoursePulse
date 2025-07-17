// controllers/noteController.js

const Note = require('../model/NoteSchema');

// Create or update a note
exports.upsertNote = async (req, res) => {
  try {
    const { userId, courseId, contentId, content, tags, isHighlight } = req.body;
    
    const filter = {
      userId,
      courseId,
      ...(contentId && { contentId })
    };
    
    const update = {
      content,
      tags,
      isHighlight,
      updatedAt: new Date()
    };
    
    const options = { upsert: true, new: true };
    
    const note = await Note.findOneAndUpdate(filter, update, options);
    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all notes for a course/user
exports.getNotes = async (req, res) => {
  try {
    const { userId, courseId } = req.query;
    
    const notes = await Note.find({ userId, courseId })
      .sort({ createdAt: -1 });
    
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a note
exports.deleteNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    await Note.findByIdAndDelete(noteId);
    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get content-specific notes
exports.getContentNotes = async (req, res) => {
  try {
    const { userId, courseId, contentId } = req.query;
    
    const notes = await Note.find({ userId, courseId, contentId })
      .sort({ position: 1 });
    
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};