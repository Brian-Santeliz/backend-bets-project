const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const router = require('./router/router')
const app = express();
app.set('puerto', process.env.PUERTO || 3000);
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/img',express.static(path.join(__dirname, 'img')));
app.use('/api',router)
app.use('/admin', express.static(path.join(__dirname, '/admin')));
app.use(express.static(path.join(__dirname, 'client')));
module.exports = { app };
