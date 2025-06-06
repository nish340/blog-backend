const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  createComment,
  getCommentsByBlog,
  updateComment,
  deleteComment,
  toggleLikeComment
} = require('../controllers/commentController');

// Protected routes
router.post('/', auth, createComment);
router.get('/blog/:blogId', getCommentsByBlog);
router.put('/:id', auth, updateComment);
router.delete('/:id', auth, deleteComment);
router.post('/:id/like', auth, toggleLikeComment);

module.exports = router;