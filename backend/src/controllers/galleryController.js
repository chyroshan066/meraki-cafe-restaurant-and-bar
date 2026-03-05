const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');
const {
  createImage,
  listImages,
  deleteImage
} = require('../models/galleryModel');

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

async function uploadImage(req, res, next) {
  try {
    const { title } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required' });
    }

    const result = await uploadToCloudinary(req.file.buffer, 'gallery');

    const image = await createImage({
      title: title || null,
      imageUrl: result.secure_url,
      imagePublicId: result.public_id
    });

    return res.status(201).json({
      message: 'Image uploaded successfully',
      image
    });
  } catch (err) {
    return next(err);
  }
}

async function list(req, res, next) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const { items, total } = await listImages({ page, limit });

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

async function remove(req, res, next) {
  try {
    const { id } = req.params;

    const page = 1;
    const limit = 1000;
    const { items } = await listImages({ page, limit });

    const image = items.find((img) => String(img.id) === String(id));

    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    if (image.image_public_id) {
      await cloudinary.uploader.destroy(image.image_public_id);
    }

    await deleteImage(id);

    return res.status(200).json({
      message: 'Image deleted successfully'
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  uploadImage,
  list,
  remove
};