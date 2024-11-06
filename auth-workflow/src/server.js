
require('dotenv').config();
const express = require('express');
const mongoose = require('./config/db');
const router = require('./routes/routes')



const app = express();
app.use(express.json());
app.use("/auth-api",router)




module.exports = app;