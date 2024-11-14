const express = require('express');
const userRoutes = require('./userRoutes');
const establishmentRoutes = require('./establishmentRoutes');
const ratingRoutes = require('./ratingRoutes');
const barangayRoutes = require('./barangayRoutes');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello World');
});

router.use('/users', userRoutes);
router.use('/establishments', establishmentRoutes);
router.use('/ratings', ratingRoutes);
router.use('/barangays', barangayRoutes);
module.exports = router;