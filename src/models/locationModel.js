const mongoose = require('mongoose');

const coordinatesSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
    },
    coordinates: {
        type: [Number],
        required: true
    }
});

// Export the schema instead of a model
module.exports = coordinatesSchema;