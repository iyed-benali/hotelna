const express = require("express");
const hotelRoutes= require('../domains/hotels/hotel-routes')
const servicesRoutes = require('../domains/services/services-routes')
const adminRoutes = require('../domains/admin/admin-routes')
const router = express.Router();

router.use('/hotel',hotelRoutes)
router.use('/admin',adminRoutes)
router.use('/services',servicesRoutes)

module.exports = router;
