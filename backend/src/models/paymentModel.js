const { pool } = require('../config/db');

async function createPayment({ orderId, amount, method, status = 'pending', transactionReference }) {
  const query = `
    INSERT INTO payments (order_id, amount, method, status, transaction_reference)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
  const values = [orderId, amount, method, status, transactionReference || null];
  const { rows } = await pool.query(query, values);
  return rows[0];
}

async function getPaymentById(id) {
  const { rows } = await pool.query('SELECT * FROM payments WHERE id = $1', [id]);
  return rows[0] || null;
}

async function listPaymentsByOrder(orderId) {
  const { rows } = await pool.query('SELECT * FROM payments WHERE order_id = $1', [orderId]);
  return rows;
}

async function updatePaymentStatus(id, status) {
  const { rows } = await pool.query(
    `
    UPDATE payments
    SET status = $1,
        updated_at = NOW()
    WHERE id = $2
    RETURNING *;
    `,
    [status, id]
  );
  return rows[0] || null;
}

module.exports = {
  createPayment,
  getPaymentById,
  listPaymentsByOrder,
  updatePaymentStatus
};

