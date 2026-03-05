const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

const {
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getMenuItemById,
  listMenuItems
} = require('../models/menuModel');

// Helper to upload buffer to Cloudinary
function uploadToCloudinary(fileBuffer, folder) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
}

async function create(req, res, next) {
  try {
    const { name, description, price, category } = req.body;

    let imageUrl = null;
    let imagePublicId = null;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'menu');
      imageUrl = result.secure_url;
      imagePublicId = result.public_id;
    }

    const item = await createMenuItem({
      name,
      description,
      price,
      category,
      imageUrl,
      imagePublicId
    });

    return res.status(201).json({
      message: 'Menu item created successfully',
      item
    });
  } catch (err) {
    return next(err);
  }
}

async function update(req, res, next) {
  try {
    const { id } = req.params;
    const { name, description, price, category } = req.body;

    const existing = await getMenuItemById(id);
    if (!existing) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    let imageUrl = existing.image_url;
    let imagePublicId = existing.image_public_id;

    if (req.file) {
      // Delete old image if exists
      if (existing.image_public_id) {
        await cloudinary.uploader.destroy(existing.image_public_id);
      }

      const result = await uploadToCloudinary(req.file.buffer, 'menu');
      imageUrl = result.secure_url;
      imagePublicId = result.public_id;
    }

    const updated = await updateMenuItem(id, {
      name,
      description,
      price,
      category,
      imageUrl,
      imagePublicId
    });

    return res.status(200).json({
      message: 'Menu item updated successfully',
      item: updated
    });
  } catch (err) {
    return next(err);
  }
}

async function remove(req, res, next) {
  try {
    const { id } = req.params;
    const existing = await getMenuItemById(id);

    if (!existing) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    // Delete image from Cloudinary
    if (existing.image_public_id) {
      await cloudinary.uploader.destroy(existing.image_public_id);
    }

    await deleteMenuItem(id);

    return res.status(200).json({
      message: 'Menu item deleted successfully'
    });
  } catch (err) {
    return next(err);
  }
}

async function list(req, res, next) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const category = req.query.category;

    const { items, total } = await listMenuItems({ page, limit, category });

    return res.status(200).json({
      data: items,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    return next(err);
  }
}

async function getById(req, res, next) {
  try {
    const { id } = req.params;
    const item = await getMenuItemById(id);

    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    return res.status(200).json(item);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  create,
  update,
  remove,
  list,
  getById
};