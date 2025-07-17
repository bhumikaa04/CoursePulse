// routes/markup.js
const express = require('express');
const router = express.Router(); // This is the crucial line you're missing
const Course = require('../model/CourseSchema');
const authenticateToken = require('../authMiddleware');

// POST endpoint to add markups
router.post('/:id/markups', authenticateToken, async (req, res) => {
  try {
    const contentId = req.params.id;
    const { userId, documentId, markups } = req.body;

    const course = await Course.findOne({ _id: courseId, ownerEmail: req.user.email });
    if (!course) {
      return res.status(404).json({ error: 'Course not found or unauthorized' });
    }

    // Find the document in the course contents
    const document = course.contents.find(content => 
      content._id.toString() === documentId && content.type === 'document'
    );

    if (!document) {
      return res.status(404).json({ error: 'Document not found in course contents' });
    }

    // Add or update markups
    if (!document.markups) {
      document.markups = [];
    }

    document.markups = markups;
    document.updatedAt = new Date();
    await course.save();

    res.status(200).json({
      message: 'Markups saved successfully',
      markups: document.markups
    });

  } catch (err) {
    console.error('Error saving markups:', err);
    res.status(500).json({ error: 'Failed to save markups' });
  }
});

// GET endpoint to retrieve markups
router.get('/:id/markups', authenticateToken, async (req, res) => {
  try {
    const courseId = req.params.id;
    const { documentId } = req.query;

    const course = await Course.findOne({ _id: courseId, ownerEmail: req.user.email });
    if (!course) {
      return res.status(404).json({ error: 'Course not found or unauthorized' });
    }

    const document = course.contents.find(content => 
      content._id.toString() === documentId && content.type === 'document'
    );

    if (!document) {
      return res.status(404).json({ error: 'Document not found in course contents' });
    }

    res.status(200).json({
      markups: document.markups || []
    });

  } catch (err) {
    console.error('Error fetching markups:', err);
    res.status(500).json({ error: 'Failed to fetch markups' });
  }
});

module.exports = router;