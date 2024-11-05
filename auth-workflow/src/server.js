
const express = require('express');
const mongoose = require('./config/db');
const router = require('./routes/routes')
require('dotenv').config();


const app = express();
app.use(express.json());
app.use("/api",router)




module.exports = app;