const express = require("express");
const router = express.Router();
const checkAuth = require("../middlewares/check-auth");

const UserController = require("../controllers/user");

// Sign up to create user
router.post("/signup", UserController.create_new_user);

// User login
router.post("/login", UserController.user_login);

// Delete user: login required
router.delete("/:userId", checkAuth, UserController.delete_user);

module.exports = router;
