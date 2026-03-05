const express = require('express');
const { body, param } = require('express-validator');

const paymentController = require('../controllers/paymentController');
const { authRequired, requireRole } = require('../middleware/authMiddleware');
const { validateRequest } = require('../middleware/validateMiddleware');

const router = express.Router();

// Customer/Admin: create payment for an order
router.post(
  '/',
  authRequired,
  [
    body('order_id').isInt({ min: 1 }).withMessage('order_id is required'),
    body('amount').isFloat({ min: 0 }).withMessage('amount must be non-negative'),
    body('method').notEmpty().withMessage('payment method is required'),
    body('transaction_reference').optional().isString()
  ],
  validateRequest,
  paymentController.create
);

// Customer/Admin: get payment by id (with access control)
router.get(
  '/:id',
  authRequired,
  [param('id').isInt({ min: 1 }).withMessage('Invalid payment id')],
  validateRequest,
  paymentController.getById
);

// Customer/Admin: list payments for an order (with access control)
router.get(
  '/order/:orderId',
  authRequired,
  [param('orderId').isInt({ min: 1 }).withMessage('Invalid order id')],
  validateRequest,
  paymentController.listByOrder
);

// Admin: update payment status (and adjust order status)
router.patch(
  '/:id/status',
  authRequired,
  requireRole('admin'),
  [
    param('id').isInt({ min: 1 }).withMessage('Invalid payment id'),
    body('status')
      .isIn(['pending', 'success', 'failed'])
      .withMessage('Status must be pending, success, or failed')
  ],
  validateRequest,
  paymentController.updateStatus
);

module.exports = router;

