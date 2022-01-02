const express = require("express");
const router = express.Router();

// Middlewares
const checkAuthForRefreshing = require('../../middleware/reftesh-auth');
const decodeRefreshTocken = require('../../middleware/decode-refresh-tocken');
const { onlyUserPermission } = require('../../middleware/permissions/userPermissions');

// // Import constrollers
const tocken = require("../../controllers/tocken/tocken");

/**
 * @swagger
 * tags:
 *   name: Tocken
 *   description: Refresh Tocken Related APIs
 */


/**
 * @swagger
 * /tocken/refresh/{userId}:
 *   get:
 *     summary: Get new tocken pair
 *     tags: [Tocken]
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: Refresh tocken and Acces tocken
 *       500:
 *         description: Some server error
 */
router.get("/refresh/:userId", checkAuthForRefreshing, onlyUserPermission(), tocken.generate_new_tocken_pair);

/**
 * @swagger
 * /tocken/logout:
 *   get:
 *     summary: Logout user
 *     tags: [Tocken]
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: Response user details
 *       500:
 *         description: Some server error
 */
router.get("/logout", decodeRefreshTocken, tocken.clear_tocken);

module.exports = router;