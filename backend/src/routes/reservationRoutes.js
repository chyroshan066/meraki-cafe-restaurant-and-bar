const express = require('express');
const { body, param, query } = require('express-validator');

const reservationController = require('../controllers/reservationController');
const { authRequired, requireRole } = require('../middleware/authMiddleware');
const { validateRequest } = require('../middleware/validateMiddleware');

const router = express.Router();

// Customer: create reservation
router.post(
  '/',
  authRequired,
  [
    body('date').isISO8601().withMessage('Valid date is required (YYYY-MM-DD)'),
    body('time').matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Valid time is required (HH:MM)'),
    body('number_of_guests')
      .isInt({ min: 1 })
      .withMessage('number_of_guests must be a positive integer')
  ],
  validateRequest,
  reservationController.create
);

// Customer: list own reservations
router.get(
  '/me',
  authRequired,
  [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt()
  ],
  validateRequest,
  reservationController.listMyReservations
);

// Customer: cancel own reservation
router.delete(
  '/:id',
  authRequired,
  [param('id').isInt().withMessage('Invalid reservation id')],
  validateRequest,
  reservationController.cancel
);

// Admin: list all reservations
router.get(
  '/',
  authRequired,
  requireRole('admin'),
  [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt()
  ],
  validateRequest,
  reservationController.listAll
);

// Admin: update reservation status
router.patch(
  '/:id/status',
  authRequired,
  requireRole('admin'),
  [
    param('id').isInt().withMessage('Invalid reservation id'),
    body('status')
      .isIn(['pending', 'approved', 'rejected', 'cancelled'])
      .withMessage('Invalid status value')
  ],
  validateRequest,
  reservationController.updateStatus
);

module.exports = router;

