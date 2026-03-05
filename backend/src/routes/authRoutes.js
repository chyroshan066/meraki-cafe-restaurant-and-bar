const express = require('express');
const { body } = require('express-validator');

const { register, login, me, logout } = require('../controllers/authController');
const { authRequired } = require('../middleware/authMiddleware');
const { validateRequest } = require('../middleware/validateMiddleware');

const router = express.Router();

router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('role').optional().isIn(['admin', 'customer']).withMessage('Role must be admin or customer')
  ],
  validateRequest,
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  validateRequest,
  login
);

router.get('/me', authRequired, me);

// Stateless JWT logout – client just discards token
router.post('/logout', authRequired, logout);

module.exports = router;



