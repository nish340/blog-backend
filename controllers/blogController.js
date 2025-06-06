const Blog = require('../models/Blog');
const ApiError = require('../utils/ApiError');

// Helper function for pagination
const getPagination = (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  return { limit: parseInt(limit), skip };
};

// Create new blog
const createBlog = async (req, res) => {
  try {
    const blog = new Blog({
      ...req.body,
      author: req.user._id
    });
    await blog.save();
    res.status(201).json(blog);
  } catch (error) {
    throw new ApiError(400, error.message);
  }
};

// Get all blogs with filtering, pagination, and sorting
const getBlogs = async (req, res) => {
  try {
    const { page, limit, category, tags, status, featured, sort, search } = req.query;
    const { skip } = getPagination(page, limit);

    // Build query
    const query = {};
    if (category) query.category = category;
    if (tags) query.tags = { $in: tags.split(',') };
    if (status) query.status = status;
    if (featured) query.featured = featured === 'true';
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort options
    let sortOptions = { createdAt: -1 }; // Default sort
    if (sort) {
      switch (sort) {
        case 'views':
          sortOptions = { viewCount: -1 };
          break;
        case 'likes':
          sortOptions = { likeCount: -1 };
          break;
        case 'oldest':
          sortOptions = { createdAt: 1 };
          break;
      }
    }

    const blogs = await Blog.find(query)
      .populate('author', 'name email')
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    const total = await Blog.countDocuments(query);

    res.json({
      blogs,
      total,
      page: parseInt(page) || 1,
      totalPages: Math.ceil(total / (parseInt(limit) || 10))
    });
  } catch (error) {
    throw new ApiError(400, error.message);
  }
};

// Get single blog
const getBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'name email')
      .populate({
        path: 'comments',
        populate: [
          { path: 'user', select: 'name email' },
          { 
            path: 'replies',
            populate: { path: 'user', select: 'name email' }
          }
        ]
      });

    if (!blog) {
      throw new ApiError(404, 'Blog not found');
    }

    // Increment view count
    blog.viewCount += 1;
    await blog.save();

    res.json(blog);
  } catch (error) {
    throw new ApiError(400, error.message);
  }
};

// Update blog
const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      throw new ApiError(404, 'Blog not found');
    }

    if (blog.author.toString() !== req.user._id.toString()) {
      throw new ApiError(403, 'You can only update your own blogs');
    }

    Object.assign(blog, req.body);
    await blog.save();
    
    res.json(blog);
  } catch (error) {
    throw new ApiError(400, error.message);
  }
};

// Delete blog
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      throw new ApiError(404, 'Blog not found');
    }

    if (blog.author.toString() !== req.user._id.toString()) {
      throw new ApiError(403, 'You can only delete your own blogs');
    }

    await blog.remove();
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    throw new ApiError(400, error.message);
  }
};

// Like/Unlike blog
const toggleLike = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      throw new ApiError(404, 'Blog not found');
    }

    const userIndex = blog.likes.indexOf(req.user._id);
    
    if (userIndex === -1) {
      blog.likes.push(req.user._id);
    } else {
      blog.likes.splice(userIndex, 1);
    }

    await blog.save();
    res.json(blog);
  } catch (error) {
    throw new ApiError(400, error.message);
  }
};

module.exports = {
  createBlog,
  getBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
  toggleLike
};