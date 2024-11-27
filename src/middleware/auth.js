const jwt = require('jsonwebtoken');
const config = require('../config/config');
const logger = require('../utils/logger');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            logger.error('No token provided');
            return res.status(401).json({ message: 'Authentication required' });
        }

        const decoded = jwt.verify(token, config.jwtSecret);
        req.user = decoded;
        next();
    } catch (error) {
        logger.error(error.message);
        res.status(401).json({ message: 'Invalid token' });
    }
};