const Reply = require('../models/Reply');
const Comment = require('../models/Comment');
const ApiError = require('../utils/ApiError');

// Helper function for pagination
const getPagination = (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  return { limit: parseInt(limit), skip };
};

// Create new reply
const createReply = async (req, res) => {
  try {
    const { commentId, content } = req.body;
    const comment = await Comment.findById(commentId);

    if (!comment) {
      throw new ApiError(404, 'Comment not found');
    }

    const reply = new Reply({
      comment: commentId,
      user: req.user._id,
      content
    });
    await reply.save();
    res.status(201).json(reply);
  } catch (error) {
    throw new ApiError(400, error.message);
  }
};

// Get replies for a specific comment with pagination
const getRepliesByComment = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const { skip } = getPagination(page, limit);

    const replies = await Reply.find({ comment: req.params.commentId })
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Reply.countDocuments({ comment: req.params.commentId });

    res.json({
      replies,
      total,
      page: parseInt(page) || 1,
      totalPages: Math.ceil(total / (parseInt(limit) || 10))
    });
  } catch (error) {
    throw new ApiError(400, error.message);
  }
};

// Update reply
const updateReply = async (req, res) => {
  try {
    const reply = await Reply.findById(req.params.id);

    if (!reply) {
      throw new ApiError(404, 'Reply not found');
    }

    if (reply.user.toString() !== req.user._id.toString()) {
      throw new ApiError(403, 'You can only update your own replies');
    }

    Object.assign(reply, req.body);
    reply.isEdited = true;
    await reply.save();

    res.json(reply);
  } catch (error) {
    throw new ApiError(400, error.message);
  }
};

// Delete reply
const deleteReply = async (req, res) => {
  try {
    const reply = await Reply.findById(req.params.id);

    if (!reply) {
      throw new ApiError(404, 'Reply not found');
    }

    if (reply.user.toString() !== req.user._id.toString()) {
      throw new ApiError(403, 'You can only delete your own replies');
    }

    await reply.remove();
    res.json({ message: 'Reply deleted successfully' });
  } catch (error) {
    throw new ApiError(400, error.message);
  }
};

// Like/Unlike reply
const toggleLikeReply = async (req, res) => {
  try {
    const reply = await Reply.findById(req.params.id);

    if (!reply) {
      throw new ApiError(404, 'Reply not found');
    }

    const userIndex = reply.likes.indexOf(req.user._id);

    if (userIndex === -1) {
      reply.likes.push(req.user._id);
    } else {
      reply.likes.splice(userIndex, 1);
    }

    await reply.save();
    res.json(reply);
  } catch (error) {
    throw new ApiError(400, error.message);
  }
};

module.exports = {
  createReply,
  getRepliesByComment,
  updateReply,
  deleteReply,
  toggleLikeReply
};