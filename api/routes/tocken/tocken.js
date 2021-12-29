const express = require("express");
const router = express.Router();

// Import constrollers
const tocken = require("../../controllers/tocken/tocken");

// Routes
router.get("/", tocken.generate_new_tocken_pair);

module.exports = router;