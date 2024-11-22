const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');
const connectDB = require('./database');
const authRoutes = require('./routes/authRoutes');
const app = express();
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
//Database connection
connectDB();

// Middleware
app.use(helmet({
    crossOriginResourcePolicy: false //disable cross origin resource policy
}));
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// Routes
app.use('/api', routes);
app.use('/auth', authRoutes);
app.use('/uploads', express.static('uploads'));

// Error handling
app.use(errorHandler);

module.exports = app;