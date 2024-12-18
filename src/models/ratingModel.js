const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    establishment_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Establishment',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    images: {
        type: [String],
        default: []
    },
    comment: {
        type: String,
        default: null
    }
});

module.exports = ratingSchema;
