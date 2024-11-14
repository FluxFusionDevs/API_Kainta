const mongoose = require('mongoose');
const coordinatesSchema = require('./locationModel');
const ratingSchema = require('./ratingModel');
const foodSchema = require('./foodModel');

const establishmentSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: coordinatesSchema,
        required: true,
        index: '2dsphere'  // Move index here
    },
    images: [{
        type: String
    }],
    menu_items: [{
        type: foodSchema,
    }],
    contact_number: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    quisines: [{
        type: String
    }],
    operating_hours: {
        type: String,
        required: true
    },
    ratings: [{
        type: ratingSchema,
        default: []
    }]
}, {
    timestamps: true
});

// Index for location-based queries
establishmentSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Establishment', establishmentSchema);
