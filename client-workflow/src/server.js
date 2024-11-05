
const express = require('express');
const mongoose = require('../../auth-workflow/src/config/db');
const router = require('./routes/routes')
require('dotenv').config();


const app = express();
app.use(express.json());
app.use("/client-api",router)




module.exports = app;