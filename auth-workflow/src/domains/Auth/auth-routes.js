const express = require("express");
const { register, login } = require("./auth-controllers"); 
const router = express.Router();

// Route for user registration
router.post("/register", register);

// Route for user login
router.post("/login", login);

module.exports = router;
