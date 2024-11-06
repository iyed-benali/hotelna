
require('dotenv').config();
require('./config/db');
const express = require('express');
const router = require('./routes/routes')



const app = express();
app.use(express.json());
app.use("/client-api",router)




module.exports = app;