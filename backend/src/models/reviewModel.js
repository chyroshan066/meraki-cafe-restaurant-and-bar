const { pool } = require('../config/db');

async function createReview({ userId, menuId, rating, comment }) {
  const query = `
    INSERT INTO reviews (user_id, menu_id, rating, comment)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const values = [userId, menuId || null, rating, comment || null];
  const { rows } = await pool.query(query, values);
  return rows[0];
}

async function listReviewsByMenu({ menuId, page = 1, limit = 10 }) {
  const offset = (page - 1) * limit;

  const reviewsQuery = `
    SELECT r.*, u.name AS user_name
    FROM reviews r
    JOIN users u ON r.user_id = u.id
    WHERE r.menu_id = $1
    ORDER BY r.created_at DESC
    LIMIT $2 OFFSET $3;
  `;
  const countQuery = `
    SELECT COUNT(*) AS total
    FROM reviews
    WHERE menu_id = $1;
  `;

  const [reviewsResult, countResult] = await Promise.all([
    pool.query(reviewsQuery, [menuId, limit, offset]),
    pool.query(countQuery, [menuId])
  ]);

  return {
    items: reviewsResult.rows,
    total: Number(countResult.rows[0].total)
  };
}

async function listReviewsByUser({ userId, page = 1, limit = 10 }) {
  const offset = (page - 1) * limit;

  const reviewsQuery = `
    SELECT r.*, m.name AS menu_name
    FROM reviews r
    LEFT JOIN menu m ON r.menu_id = m.id
    WHERE r.user_id = $1
    ORDER BY r.created_at DESC
    LIMIT $2 OFFSET $3;
  `;
  const countQuery = `
    SELECT COUNT(*) AS total
    FROM reviews
    WHERE user_id = $1;
  `;

  const [reviewsResult, countResult] = await Promise.all([
    pool.query(reviewsQuery, [userId, limit, offset]),
    pool.query(countQuery, [userId])
  ]);

  return {
    items: reviewsResult.rows,
    total: Number(countResult.rows[0].total)
  };
}

async function deleteReview(id, userId, isAdmin = false) {
  if (isAdmin) {
    const { rows } = await pool.query('DELETE FROM reviews WHERE id = $1 RETURNING *;', [id]);
    return rows[0] || null;
  }

  const { rows } = await pool.query(
    'DELETE FROM reviews WHERE id = $1 AND user_id = $2 RETURNING *;',
    [id, userId]
  );
  return rows[0] || null;
}

module.exports = {
  createReview,
  listReviewsByMenu,
  listReviewsByUser,
  deleteReview
};

