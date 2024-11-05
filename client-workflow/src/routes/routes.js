const express = require("express");
const hotelRoutes= require('../domains/hotels/hotel-routes')
const router = express.Router();

router.use('/hotel',hotelRoutes)

module.exports = router;
