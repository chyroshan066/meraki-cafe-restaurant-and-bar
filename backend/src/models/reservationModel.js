const { pool } = require('../config/db');

async function createReservation({ 
  userId, 
  date, 
  time, 
  numberOfGuests, 
  name, 
  phoneNo, 
  message 
}) {
  const query = `
    INSERT INTO reservations 
    (user_id, date, time, number_of_guests, status, name, phone_no, message)
    VALUES ($1, $2, $3, $4, 'pending', $5, $6, $7)
    RETURNING *;
  `;

  const values = [
    userId, 
    date, 
    time, 
    numberOfGuests, 
    name, 
    phoneNo, 
    message
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
}

async function getReservationById(id) {
  const { rows } = await pool.query('SELECT * FROM reservations WHERE id = $1', [id]);
  return rows[0] || null;
}

async function listReservationsByUser({ userId, page = 1, limit = 10 }) {
  const offset = (page - 1) * limit;
  const reservationQuery = `
    SELECT * FROM reservations
    WHERE user_id = $1
    ORDER BY date DESC, time DESC
    LIMIT $2 OFFSET $3;
  `;
  const countQuery = `
    SELECT COUNT(*) AS total
    FROM reservations
    WHERE user_id = $1;
  `;
  const [resResult, countResult] = await Promise.all([
    pool.query(reservationQuery, [userId, limit, offset]),
    pool.query(countQuery, [userId])
  ]);

  return {
    items: resResult.rows,
    total: Number(countResult.rows[0].total)
  };
}

async function listAllReservations({ page = 1, limit = 10 }) {
  const offset = (page - 1) * limit;
  const reservationQuery = `
    SELECT r.*, u.name AS customer_name, u.email AS customer_email
    FROM reservations r
    JOIN users u ON r.user_id = u.id
    ORDER BY date DESC, time DESC
    LIMIT $1 OFFSET $2;
  `;
  const countQuery = `
    SELECT COUNT(*) AS total
    FROM reservations;
  `;
  const [resResult, countResult] = await Promise.all([
    pool.query(reservationQuery, [limit, offset]),
    pool.query(countQuery)
  ]);

  return {
    items: resResult.rows,
    total: Number(countResult.rows[0].total)
  };
}

async function updateReservationStatus(id, status) {
  const { rows } = await pool.query(
    `
    UPDATE reservations
    SET status = $1,
        updated_at = NOW()
    WHERE id = $2
    RETURNING *;
    `,
    [status, id]
  );
  return rows[0] || null;
}

async function cancelReservation(id, userId) {
  const { rows } = await pool.query(
    `
    UPDATE reservations
    SET status = 'cancelled',
        updated_at = NOW()
    WHERE id = $1 AND user_id = $2
    RETURNING *;
    `,
    [id, userId]
  );
  return rows[0] || null;
}

module.exports = {
  createReservation,
  getReservationById,
  listReservationsByUser,
  listAllReservations,
  updateReservationStatus,
  cancelReservation
};

