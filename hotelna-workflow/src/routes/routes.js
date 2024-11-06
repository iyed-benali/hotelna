const express = require("express");
const hotelRoutes= require('../domains/hotels/hotel-routes')

const adminRoutes = require('../domains/admin/admin-routes')
const clinetRoutes = require('../domains/clients/client-routes')
const router = express.Router();

router.use('/hotel',hotelRoutes)
router.use('/admin',adminRoutes)
router.use('/client',clinetRoutes)


module.exports = router;
