const Comment = require('../models/Comment');
const Blog = require('../models/Blog');
const ApiError = require('../utils/ApiError');

// Helper function for pagination
const getPagination = (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  return { limit: parseInt(limit), skip };
};

// Create new comment
const createComment = async (req, res) => {
  try {
    const { blogId, content } = req.body;
    const blog = await Blog.findById(blogId);

    if (!blog) {
      throw new ApiError(404, 'Blog not found');
    }

    const comment = new Comment({
      blog: blogId,
      user: req.user._id,
      content
    });
    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    throw new ApiError(400, error.message);
  }
};

// Get comments for a specific blog with pagination
const getCommentsByBlog = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const { skip } = getPagination(page, limit);

    const comments = await Comment.find({ blog: req.params.blogId })
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Comment.countDocuments({ blog: req.params.blogId });

    res.json({
      comments,
      total,
      page: parseInt(page) || 1,
      totalPages: Math.ceil(total / (parseInt(limit) || 10))
    });
  } catch (error) {
    throw new ApiError(400, error.message);
  }
};

// Update comment
const updateComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      throw new ApiError(404, 'Comment not found');
    }

    if (comment.user.toString() !== req.user._id.toString()) {
      throw new ApiError(403, 'You can only update your own comments');
    }

    Object.assign(comment, req.body);
    comment.isEdited = true;
    await comment.save();

    res.json(comment);
  } catch (error) {
    throw new ApiError(400, error.message);
  }
};

// Delete comment
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      throw new ApiError(404, 'Comment not found');
    }

    if (comment.user.toString() !== req.user._id.toString()) {
      throw new ApiError(403, 'You can only delete your own comments');
    }

    await comment.remove();
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    throw new ApiError(400, error.message);
  }
};

// Like/Unlike comment
const toggleLikeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      throw new ApiError(404, 'Comment not found');
    }

    const userIndex = comment.likes.indexOf(req.user._id);

    if (userIndex === -1) {
      comment.likes.push(req.user._id);
    } else {
      comment.likes.splice(userIndex, 1);
    }

    await comment.save();
    res.json(comment);
  } catch (error) {
    throw new ApiError(400, error.message);
  }
};

module.exports = {
  createComment,
  getCommentsByBlog,
  updateComment,
  deleteComment,
  toggleLikeComment
};