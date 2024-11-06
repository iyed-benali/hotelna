const express = require("express");
const router = express.Router();
const {createServiceRequest,getClientServices,modifyPassword,deletePassword,modifyClientDetails} = require("./client-controllers"); 
const verifyToken = require('../../middlwares/verify-token')





router.post("/service-submit",verifyToken,createServiceRequest)
router.get('/services/:clientId', getClientServices);
router.put('/password/:clientId', modifyPassword);
router.put('/details/:clientId', modifyClientDetails);


module.exports = router;
