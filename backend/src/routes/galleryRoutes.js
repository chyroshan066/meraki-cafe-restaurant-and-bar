const express = require('express');
const { body, param, query } = require('express-validator');

const galleryController = require('../controllers/galleryController');
const { authRequired, requireRole } = require('../middleware/authMiddleware');
const { validateRequest } = require('../middleware/validateMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

const router = express.Router();

// Public: list images
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt()
  ],
  validateRequest,
  galleryController.list
);

// Admin: upload image
router.post(
  '/',
  authRequired,
  requireRole('admin'),
  upload.single('image'),
  [body('title').optional().isString()],
  validateRequest,
  galleryController.uploadImage
);

// Admin: delete image
router.delete(
  '/:id',
  authRequired,
  requireRole('admin'),
  [param('id').isInt().withMessage('Invalid image id')],
  validateRequest,
  galleryController.remove
);

module.exports = router;

