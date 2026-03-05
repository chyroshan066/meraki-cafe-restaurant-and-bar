const {
  createPayment,
  getPaymentById,
  listPaymentsByOrder,
  updatePaymentStatus
} = require('../models/paymentModel');
const { getOrderById, updateOrderStatus } = require('../models/orderModel');

async function create(req, res, next) {
  try {
    const { order_id, amount, method, transaction_reference } = req.body;

    const orderData = await getOrderById(order_id);
    if (!orderData) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (req.user.role !== 'admin' && orderData.order.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden: cannot pay for this order' });
    }

    if (Number(amount) !== Number(orderData.order.total_amount)) {
      return res.status(400).json({ message: 'Amount must equal order total amount' });
    }

    const payment = await createPayment({
      orderId: order_id,
      amount,
      method,
      status: 'pending',
      transactionReference: transaction_reference
    });

    return res.status(201).json({
      message: 'Payment created successfully (simulate gateway processing)',
      payment
    });
  } catch (err) {
    return next(err);
  }
}

async function getById(req, res, next) {
  try {
    const { id } = req.params;
    const payment = await getPaymentById(id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    const orderData = await getOrderById(payment.order_id);
    if (req.user.role !== 'admin' && orderData.order.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden: cannot access this payment' });
    }

    return res.status(200).json(payment);
  } catch (err) {
    return next(err);
  }
}

async function listByOrder(req, res, next) {
  try {
    const { orderId } = req.params;
    const orderData = await getOrderById(orderId);
    if (!orderData) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (req.user.role !== 'admin' && orderData.order.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden: cannot access payments for this order' });
    }

    const payments = await listPaymentsByOrder(orderId);
    return res.status(200).json(payments);
  } catch (err) {
    return next(err);
  }
}

// Admin-only helper to mark payments and orders as success/failed
async function updateStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'success', 'failed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid payment status' });
    }

    const payment = await getPaymentById(id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    const updatedPayment = await updatePaymentStatus(id, status);

    if (status === 'success') {
      await updateOrderStatus(payment.order_id, 'paid');
    } else if (status === 'failed') {
      await updateOrderStatus(payment.order_id, 'pending');
    }

    return res.status(200).json({
      message: 'Payment status updated',
      payment: updatedPayment
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  create,
  getById,
  listByOrder,
  updateStatus
};

