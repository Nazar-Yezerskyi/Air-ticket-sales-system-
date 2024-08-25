const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const authRoutes = require('./routes/auth.js');
const mysql = require('mysql2');
const dbConnection = require('./dbConnection');
const searchRouters = require('./routes/search.js');
const ticketRouters = require('./routes/ticket.js')
const adminRouters = require('./routes/admin.js')
const adminAddRouters = require('./routes/adminAdd.js')

app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



const connection = dbConnection();

app.use('/api/auth', authRoutes(connection));
app.use('/api/search',searchRouters(connection));
app.use('/api/ticket',ticketRouters(connection));
app.use('/api/admin',adminRouters);
app.use('/api/adminAdd', adminAddRouters(connection))

module.exports = app;