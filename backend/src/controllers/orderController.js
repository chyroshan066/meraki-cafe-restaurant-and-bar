const { createOrder, getOrderById, listOrdersByUser, listAllOrders } = require('../models/orderModel');

async function create(req, res, next) {
  try {
    const { items } = req.body;

    const normalizedItems = items.map((item) => ({
      menuId: item.menu_id,
      quantity: Number(item.quantity),
      unitPrice: Number(item.unit_price)
    }));

    const result = await createOrder({
      userId: req.user.id,
      items: normalizedItems
    });

    return res.status(201).json({
      message: 'Order created successfully',
      order: result.order,
      items: result.items
    });
  } catch (err) {
    return next(err);
  }
}

async function getById(req, res, next) {
  try {
    const { id } = req.params;
    const data = await getOrderById(id);
    if (!data) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (req.user.role !== 'admin' && data.order.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden: cannot access this order' });
    }

    return res.status(200).json(data);
  } catch (err) {
    return next(err);
  }
}

async function listMyOrders(req, res, next) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const { items, total } = await listOrdersByUser({
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

async function listAll(req, res, next) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const { items, total } = await listAllOrders({ page, limit });

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

module.exports = {
  create,
  getById,
  listMyOrders,
  listAll
};

