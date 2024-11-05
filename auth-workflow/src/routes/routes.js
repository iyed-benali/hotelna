const express = require("express");
const profileRoutes = require("../domains/Auth/auth-routes"); 
const otpRoutes = require("../domains/Otp/otp-routes")
const router = express.Router();

router.use("/auth", profileRoutes);
router.use("/otp", otpRoutes);

module.exports = router;
