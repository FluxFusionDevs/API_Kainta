const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const { createUploadMiddleware } = require('../middleware/upload');


const uploadImages = createUploadMiddleware({
    fields: [
        {
            directory: 'uploads/ratingImages',
            filePrefix: 'rating',
            fieldName: 'ratingImages',
            maxSize: 5 * 1024 * 1024 // 5MB
        }
    ]
});


router.post('/create-rating', uploadImages, ratingController.createRating);
router.get('/:establishmentId', ratingController.getRatingsByEstablishmentId);
router.put('/update-rating', ratingController.updateRating);
router.delete('/delete-rating', ratingController.deleteRating);

module.exports = router;
