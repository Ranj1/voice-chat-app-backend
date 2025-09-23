// routes/chat.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const ChatSession = require('../models/ChatSession');
const Question = require('../models/Question');

// Create new chat session
router.post('/new', authMiddleware, async (req, res) => {
  try {
    const newSession = new ChatSession({
      user: req.user.id,
      title: "New Chat"
    });
    await newSession.save();
    res.json(newSession);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get all chat sessions for user
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const sessions = await ChatSession.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(sessions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get all questions for a specific session
router.get('/:sessionId', authMiddleware, async (req, res) => {
  try {
    const questions = await Question.find({ chatSession: req.params.sessionId }).sort({ createdAt: 1 });
    res.json(questions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Add a question and answer to a session
router.post('/:sessionId/question', authMiddleware, async (req, res) => {
  try {
    const { questionText, answerText } = req.body;

    const newQuestion = new Question({
      chatSession: req.params.sessionId,
      questionText,
      answerText
    });

    await newQuestion.save();
    res.json(newQuestion);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Upload voice and get answer (placeholder)
router.post('/:sessionId/voice', authMiddleware, async (req, res) => {
  try {
    // For now, we just return a dummy answer
    // Later, you will process req.file or base64 audio and call Gemini API

    const dummyAnswer = "This is a placeholder answer from the voice input.";

    res.json({
      sessionId: req.params.sessionId,
      answer: dummyAnswer
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
