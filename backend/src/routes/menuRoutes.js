const express = require('express');
const { body, param, query } = require('express-validator');

const menuController = require('../controllers/menuController');
const { authRequired, requireRole } = require('../middleware/authMiddleware');
const { validateRequest } = require('../middleware/validateMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

const router = express.Router();

// Public: list menu items
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 500 }).toInt(),
    query('category').optional().isString()
  ],
  validateRequest,
  menuController.list
);

// Public: get single menu item
router.get(
  '/:id',
  [param('id').isInt().withMessage('Invalid menu id')],
  validateRequest,
  menuController.getById
);

// Admin: create menu item (with optional image)
router.post(
  '/',
  authRequired,
  requireRole('admin'),
  upload.single('image'),
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
    body('category').notEmpty().withMessage('Category is required')
  ],
  validateRequest,
  menuController.create
);

// Admin: update menu item
router.put(
  '/:id',
  authRequired,
  requireRole('admin'),
  upload.single('image'),
  [
    param('id').isInt().withMessage('Invalid menu id'),
    body('name').notEmpty().withMessage('Name is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
    body('category').notEmpty().withMessage('Category is required')
  ],
  validateRequest,
  menuController.update
);

// Admin: delete menu item
router.delete(
  '/:id',
  authRequired,
  requireRole('admin'),
  [param('id').isInt().withMessage('Invalid menu id')],
  validateRequest,
  menuController.remove
);

module.exports = router;

