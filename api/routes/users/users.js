const express = require("express");
const router = express.Router();

// Middlewares
const checkAuth = require('../../middleware/check-auth');
const { onlyUserPermission } = require('../../middleware/permissions/userPermissions');

// Import constrollers
const users = require("../../controllers/users/users");

// Routes
router.post("/signup", users.user_signup);
router.post("/login", users.user_login);
router.patch("/details/:userId", checkAuth, onlyUserPermission(), users.user_update);
router.get("/details/:userId", checkAuth, onlyUserPermission(), users.get_specfic_user);
router.patch("/password/:userId", checkAuth, onlyUserPermission(), users.user_change_password);
router.post("/profilepic/:userId", checkAuth, onlyUserPermission(), users.user_uplord_profilepic);

module.exports = router;