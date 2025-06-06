const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  createReply,
  getRepliesByComment,
  updateReply,
  deleteReply,
  toggleLikeReply
} = require('../controllers/replyController');

// Protected routes
router.post('/', auth, createReply);
router.get('/comment/:commentId', getRepliesByComment);
router.put('/:id', auth, updateReply);
router.delete('/:id', auth, deleteReply);
router.post('/:id/like', auth, toggleLikeReply);

module.exports = router;