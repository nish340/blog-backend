const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth, adminOnly } = require('../middleware/auth');

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Protected routes
router.get('/', auth, adminOnly, userController.getAllUsers);
router.get('/:id', auth, userController.getUserById);
router.put('/:id', auth, userController.updateUser);
router.delete('/:id', auth, adminOnly, userController.deleteUser);

module.exports = router;