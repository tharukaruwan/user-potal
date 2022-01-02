const express = require("express");
const router = express.Router();
const multer = require('multer');


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './profilepic/')
    },
    filename: function (req, file, cb) {
        cb(null, req.userData.id + file.originalname)
    }
})

const upload = multer({ storage: storage })

// Middlewares
const checkAuth = require('../../middleware/check-auth');
const { onlyUserPermission } = require('../../middleware/permissions/userPermissions');

// Import constrollers
const users = require("../../controllers/users/users");

// Routes

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User Related APIs
 */

/**
 * @swagger
 * /users/signup:
 *   post:
 *     summary: Signup new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: Signup sucessfil
 *       500:
 *         description: Some server error
 */
router.post("/signup", users.user_signup);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: Signup sucessfil
 *       500:
 *         description: Some server error
 */
router.post("/login", users.user_login);

/**
 * @swagger
 * /users/details/{userId}:
 *   patch:
 *     summary: Update user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: Update sucessful
 *       500:
 *         description: Some server error
 */
router.patch("/details/:userId", checkAuth, onlyUserPermission(), users.user_update);


/**
 * @swagger
 * /users/details/{userId}:
 *   get:
 *     summary: Get a user details
 *     tags: [User]
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: Response user details
 *       500:
 *         description: Some server error
 */
router.get("/details/:userId", checkAuth, onlyUserPermission(), users.get_specfic_user);

/**
 * @swagger
 * /users/password/{userId}:
 *   patch:
 *     summary: Change user password
 *     tags: [User]
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: Password has been changed!
 *       401:
 *         description: Authentication failed. Please try again
 *       500:
 *         description: Unknown error! Please try again
 */
router.patch("/password/:userId", checkAuth, onlyUserPermission(), users.user_change_password);

/**
 * @swagger
 * /users/profilepic/{userId}:
 *   post:
 *     summary: Uplord new profile picture
 *     tags: [User]
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: Profile picture has been updated!
 *       500:
 *         description: Unknown error! Please try again
 */
router.post("/profilepic/:userId", checkAuth, onlyUserPermission(), upload.single("profilepic"), users.user_uplord_profilepic);

/**
 * @swagger
 * /users/profilepic/{filename}:
 *   get:
 *     summary: Profile picture endpoint - stream response
 *     tags: [User]
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: Profile picture!
 *       500:
 *         description: Unknown error! Please try again
 */
router.get("/profilepic/:filename", users.user_get_profilepic); // just unprotected profile endpoint * stream response

module.exports = router;