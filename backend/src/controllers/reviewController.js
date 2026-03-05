const {
  createReview,
  listReviewsByMenu,
  listReviewsByUser,
  deleteReview
} = require('../models/reviewModel');

async function create(req, res, next) {
  try {
    const { menu_id, rating, comment } = req.body;

    const review = await createReview({
      userId: req.user.id,
      menuId: menu_id || null,
      rating,
      comment
    });

    return res.status(201).json({
      message: 'Review created successfully',
      review
    });
  } catch (err) {
    return next(err);
  }
}

async function listForMenu(req, res, next) {
  try {
    const { menuId } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const { items, total } = await listReviewsByMenu({
      menuId,
      page,
      limit
    });

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

async function listMine(req, res, next) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const { items, total } = await listReviewsByUser({
      userId: req.user.id,
      page,
      limit
    });

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
    const isAdmin = req.user.role === 'admin';

    const deleted = await deleteReview(id, req.user.id, isAdmin);
    if (!deleted) {
      return res.status(404).json({
        message: 'Review not found or not owned by current user'
      });
    }

    return res.status(200).json({
      message: 'Review deleted successfully'
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  create,
  listForMenu,
  listMine,
  remove
};

