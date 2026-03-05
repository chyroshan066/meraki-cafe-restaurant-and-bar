const express = require('express');
const { body, param, query } = require('express-validator');

const reviewController = require('../controllers/reviewController');
const { authRequired } = require('../middleware/authMiddleware');
const { validateRequest } = require('../middleware/validateMiddleware');

const router = express.Router();

// Customer/Admin: create review for a menu item (or general if menu_id omitted)
router.post(
  '/',
  authRequired,
  [
    body('menu_id').optional().isInt({ min: 1 }).withMessage('menu_id must be positive'),
    body('rating')
      .isInt({ min: 1, max: 5 })
      .withMessage('rating must be between 1 and 5'),
    body('comment').optional().isString()
  ],
  validateRequest,
  reviewController.create
);

// Public: list reviews for a specific menu item
router.get(
  '/menu/:menuId',
  [
    param('menuId').isInt({ min: 1 }).withMessage('Invalid menu id'),
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt()
  ],
  validateRequest,
  reviewController.listForMenu
);

// Customer: list own reviews
router.get(
  '/me',
  authRequired,
  [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt()
  ],
  validateRequest,
  reviewController.listMine
);

// Customer/Admin: delete review (owner or admin, logic in controller)
router.delete(
  '/:id',
  authRequired,
  [param('id').isInt({ min: 1 }).withMessage('Invalid review id')],
  validateRequest,
  reviewController.remove
);

module.exports = router;
