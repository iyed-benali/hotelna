const express = require('express');
const router = express.Router();
const { createHotel, getAllHotels, getAllClients, deleteHotel, updateHotel } = require('./admin-controllers');
const verifyAdmin = require("../../middlwares/verify-admin"); 

// Routes for hotel management
router.post('/create',verifyAdmin, createHotel);       
router.get('/hotels',verifyAdmin, getAllHotels);         
router.get('/clients',verifyAdmin, getAllClients);       
router.delete('/hotel/:hotelId',verifyAdmin, deleteHotel);
router.put('/hotel/:hotelId',verifyAdmin, updateHotel);    

module.exports = router;
