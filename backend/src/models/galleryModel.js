const { pool } = require('../config/db');

async function createImage({ title, imageUrl, imagePublicId }) {
  const query = `
    INSERT INTO gallery (
      title,
      image_url,
      image_public_id
    )
    VALUES ($1, $2, $3)
    RETURNING *;
  `;

  const values = [title, imageUrl, imagePublicId];

  const { rows } = await pool.query(query, values);
  return rows[0];
}

async function listImages({ page = 1, limit = 20 }) {
  const offset = (page - 1) * limit;

  const imagesQuery = `
    SELECT * FROM gallery
    ORDER BY created_at DESC
    LIMIT $1 OFFSET $2;
  `;

  const countQuery = `
    SELECT COUNT(*) AS total
    FROM gallery;
  `;

  const [imagesResult, countResult] = await Promise.all([
    pool.query(imagesQuery, [limit, offset]),
    pool.query(countQuery)
  ]);

  return {
    items: imagesResult.rows,
    total: Number(countResult.rows[0].total)
  };
}

async function deleteImage(id) {
  await pool.query('DELETE FROM gallery WHERE id = $1', [id]);
}

module.exports = {
  createImage,
  listImages,
  deleteImage
};