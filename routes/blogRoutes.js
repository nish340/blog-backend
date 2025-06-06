const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  createBlog,
  getBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
  toggleLike
} = require('../controllers/blogController');

// Public routes
router.get('/', getBlogs);
router.get('/:id', getBlog);

// Protected routes
router.post('/', auth, createBlog);
router.put('/:id', auth, updateBlog);
router.delete('/:id', auth, deleteBlog);
router.post('/:id/like', auth, toggleLike);

module.exports = router;