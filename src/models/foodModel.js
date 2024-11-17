const mongoose = require('mongoose');

// Define food types enum
const FoodType = {
    APPETIZER: 'APPETIZER',
    MAIN_COURSE: 'MAIN_COURSE',
    DESSERT: 'DESSERT',
    BEVERAGE: 'BEVERAGE',
    SNACK: 'SNACK',
    VEGETARIAN: 'VEGETARIAN',
    VEGAN: 'VEGAN',
    GLUTEN_FREE: 'GLUTEN_FREE',
    SPICY: 'SPICY',
    SEAFOOD: 'SEAFOOD'
};

const foodSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    tags: [{
        type: String,
        enum: Object.values(FoodType)
    }],
    image: {
        type: String,  // URI for the image
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
}, {
    timestamps: true
});

// Export both the model and the FoodType enum
module.exports = foodSchema;