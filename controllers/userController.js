const User = require('../models/User');

const userController = {
  // Register new user
  register: async (req, res) => {
    try {
      const user = new User(req.body);
      await user.save();
      const token = user.generateAuthToken();
      const { password, ...userWithoutPassword } = user.toObject();
      res.status(201).json({ user: userWithoutPassword, token });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Login user
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = user.generateAuthToken();
      const { password: userPassword, ...userWithoutPassword } = user.toObject();
      res.json({ user: userWithoutPassword, token });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Get all users (admin only)
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find({}).select('-password');
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get user by ID
  getUserById: async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select('-password');
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update user
  updateUser: async (req, res) => {
    try {
      // Prevent role updates through this endpoint
      if (req.body.role) {
        delete req.body.role;
      }
      
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      ).select('-password');
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Delete user
  deleteUser: async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = userController;