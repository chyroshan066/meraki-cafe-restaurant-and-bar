const {
  createReservation,
  listReservationsByUser,
  listAllReservations,
  updateReservationStatus,
  cancelReservation,
  getReservationById
} = require('../models/reservationModel');

async function create(req, res, next) {
  try {
    const { 
      date, 
      time, 
      number_of_guests, 
      name, 
      phone_no, 
      message 
    } = req.body;

    const reservation = await createReservation({
      userId: req.user.id,
      date,
      time,
      numberOfGuests: number_of_guests,
      name,
      phoneNo: phone_no,
      message
    });

    return res.status(201).json({
      message: 'Reservation created successfully',
      reservation
    });
  } catch (err) {
    return next(err);
  }
}

async function listMyReservations(req, res, next) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const { items, total } = await listReservationsByUser({
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

async function cancel(req, res, next) {
  try {
    const { id } = req.params;
    const reservation = await cancelReservation(id, req.user.id);
    if (!reservation) {
      return res.status(404).json({
        message: 'Reservation not found or not owned by current user'
      });
    }
    return res.status(200).json({
      message: 'Reservation cancelled successfully',
      reservation
    });
  } catch (err) {
    return next(err);
  }
}

async function listAll(req, res, next) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const { items, total } = await listAllReservations({ page, limit });

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

async function updateStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'approved', 'rejected', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const existing = await getReservationById(id);
    if (!existing) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    const updated = await updateReservationStatus(id, status);

    return res.status(200).json({
      message: 'Reservation status updated successfully',
      reservation: updated
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  create,
  listMyReservations,
  cancel,
  listAll,
  updateStatus
};

