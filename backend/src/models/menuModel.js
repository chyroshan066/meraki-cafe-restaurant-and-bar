const { pool } = require('../config/db');

async function createMenuItem({
  name,
  description,
  price,
  category,
  imageUrl,
  imagePublicId
}) {
  const query = `
    INSERT INTO menu (
      name,
      description,
      price,
      category,
      image_url,
      image_public_id
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;

  const values = [
    name,
    description,
    price,
    category,
    imageUrl,
    imagePublicId
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
}

async function updateMenuItem(
  id,
  { name, description, price, category, imageUrl, imagePublicId }
) {
  const query = `
    UPDATE menu
    SET name = $1,
        description = $2,
        price = $3,
        category = $4,
        image_url = $5,
        image_public_id = $6,
        updated_at = NOW()
    WHERE id = $7
    RETURNING *;
  `;

  const values = [
    name,
    description,
    price,
    category,
    imageUrl,
    imagePublicId,
    id
  ];

  const { rows } = await pool.query(query, values);
  return rows[0] || null;
}

async function deleteMenuItem(id) {
  await pool.query('DELETE FROM menu WHERE id = $1', [id]);
}

async function getMenuItemById(id) {
  const { rows } = await pool.query(
    'SELECT * FROM menu WHERE id = $1',
    [id]
  );
  return rows[0] || null;
}

async function listMenuItems({ page = 1, limit = 10, category }) {
  const offset = (page - 1) * limit;
  const params = [];
  let where = '';

  if (category) {
    params.push(category);
    where = `WHERE category = $${params.length}`;
  }

  params.push(limit, offset);

  const query = `
    SELECT * FROM menu
    ${where}
    ORDER BY created_at DESC
    LIMIT $${params.length - 1} OFFSET $${params.length};
  `;

  const countQuery = `
    SELECT COUNT(*) AS total
    FROM menu
    ${where};
  `;

  const [itemsResult, countResult] = await Promise.all([
    pool.query(query, params),
    pool.query(countQuery, params.slice(0, where ? 1 : 0))
  ]);

  return {
    items: itemsResult.rows,
    total: Number(countResult.rows[0].total)
  };
}

module.exports = {
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getMenuItemById,
  listMenuItems
};