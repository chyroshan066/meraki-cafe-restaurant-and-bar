const express = require("express");
const userController = require("../controllers/userController");

const { authRequired, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

// Admin: get all users
router.get(
  "/",
  authRequired,
  requireRole("admin"),
  userController.listUsers
);

module.exports = router;