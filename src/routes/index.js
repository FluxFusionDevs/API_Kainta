const express = require('express');
const userRoutes = require('./userRoutes');
const establishmentRoutes = require('./establishmentRoutes');
const ratingRoutes = require('./ratingRoutes');
const barangayRoutes = require('./barangayRoutes');
const router = express.Router();
const foodRoutes = require('./foodRoutes');

router.get('/', (req, res) => {
    res.send('Hello World');
});

router.use('/users', userRoutes);
router.use('/establishments', establishmentRoutes);
router.use('/ratings', ratingRoutes);
router.use('/barangays', barangayRoutes);
router.use('/foods', foodRoutes);
module.exports = router;