const { pool } = require('../config/db');

async function createOrder({ userId, items }) {
  // items: [{ menuId, quantity, unitPrice }]
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const totalAmount = items.reduce(
      (sum, item) => sum + Number(item.unitPrice) * Number(item.quantity),
      0
    );

    const orderInsert = `
      INSERT INTO orders (user_id, total_amount, status)
      VALUES ($1, $2, 'pending')
      RETURNING *;
    `;
    const { rows: orderRows } = await client.query(orderInsert, [userId, totalAmount]);
    const order = orderRows[0];

    const itemInsert = `
      INSERT INTO order_items (order_id, menu_id, quantity, unit_price)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    const orderItems = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const item of items) {
      // eslint-disable-next-line no-await-in-loop
      const { rows } = await client.query(itemInsert, [
        order.id,
        item.menuId,
        item.quantity,
        item.unitPrice
      ]);
      orderItems.push(rows[0]);
    }

    await client.query('COMMIT');

    return {
      order,
      items: orderItems
    };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function getOrderById(id) {
  const orderQuery = 'SELECT * FROM orders WHERE id = $1';
  const itemsQuery = 'SELECT * FROM order_items WHERE order_id = $1';

  const [orderResult, itemsResult] = await Promise.all([
    pool.query(orderQuery, [id]),
    pool.query(itemsQuery, [id])
  ]);

  if (orderResult.rows.length === 0) return null;

  return {
    order: orderResult.rows[0],
    items: itemsResult.rows
  };
}

async function listOrdersByUser({ userId, page = 1, limit = 10 }) {
  const offset = (page - 1) * limit;

  const ordersQuery = `
    SELECT * FROM orders
    WHERE user_id = $1
    ORDER BY created_at DESC
    LIMIT $2 OFFSET $3;
  `;
  const countQuery = `
    SELECT COUNT(*) AS total
    FROM orders
    WHERE user_id = $1;
  `;

  const [ordersResult, countResult] = await Promise.all([
    pool.query(ordersQuery, [userId, limit, offset]),
    pool.query(countQuery, [userId])
  ]);

  return {
    items: ordersResult.rows,
    total: Number(countResult.rows[0].total)
  };
}

async function listAllOrders({ page = 1, limit = 10 }) {
  const offset = (page - 1) * limit;

  const ordersQuery = `
    SELECT o.*, u.name AS customer_name, u.email AS customer_email
    FROM orders o
    JOIN users u ON o.user_id = u.id
    ORDER BY o.created_at DESC
    LIMIT $1 OFFSET $2;
  `;
  const countQuery = `
    SELECT COUNT(*) AS total
    FROM orders;
  `;

  const [ordersResult, countResult] = await Promise.all([
    pool.query(ordersQuery, [limit, offset]),
    pool.query(countQuery)
  ]);

  return {
    items: ordersResult.rows,
    total: Number(countResult.rows[0].total)
  };
}

async function updateOrderStatus(id, status) {
  const { rows } = await pool.query(
    `
    UPDATE orders
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
  createOrder,
  getOrderById,
  listOrdersByUser,
  listAllOrders,
  updateOrderStatus
};

