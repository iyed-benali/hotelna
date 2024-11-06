const express = require("express");
const hotelRoutes= require('../domains/hotels/hotel-routes')
const servicesRoutes = require('../domains/services/services-routes')
const router = express.Router();

router.use('/hotel',hotelRoutes)
router.use('/services',servicesRoutes)

module.exports = router;
