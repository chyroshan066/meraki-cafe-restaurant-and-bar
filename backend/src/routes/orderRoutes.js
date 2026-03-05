const express = require('express');
const { body, param, query } = require('express-validator');

const orderController = require('../controllers/orderController');
const { authRequired, requireRole } = require('../middleware/authMiddleware');
const { validateRequest } = require('../middleware/validateMiddleware');

const router = express.Router();

// Customer: create order
router.post(
  '/',
  authRequired,
  [
    body('items')
      .isArray({ min: 1 })
      .withMessage('Items array is required'),
    body('items.*.menu_id').isInt({ min: 1 }).withMessage('menu_id must be a positive integer'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('quantity must be a positive integer'),
    body('items.*.unit_price')
      .isFloat({ min: 0 })
      .withMessage('unit_price must be a non-negative number')
  ],
  validateRequest,
  orderController.create
);

// Customer: list own orders
router.get(
  '/me',
  authRequired,
  [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt()
  ],
  validateRequest,
  orderController.listMyOrders
);

// Admin: list all orders
router.get(
  '/',
  authRequired,
  requireRole('admin'),
  [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt()
  ],
  validateRequest,
  orderController.listAll
);

// Customer/Admin: get order details by id (with access control in controller)
router.get(
  '/:id',
  authRequired,
  [param('id').isInt({ min: 1 }).withMessage('Invalid order id')],
  validateRequest,
  orderController.getById
);

module.exports = router;

