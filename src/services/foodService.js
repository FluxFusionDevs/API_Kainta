const Establishment = require('../models/establishmentModel');
const mongoose = require('mongoose');

exports.addFoodItem = async (establishmentId, foodItem) => {
    console.log(establishmentId);
    if (!mongoose.Types.ObjectId.isValid(establishmentId)) {
        throw new Error('Invalid establishment ID');
    }

    const foodItemId = {
        _id: new mongoose.Types.ObjectId(),
        ...foodItem,
    };

    const establishment = await Establishment.findByIdAndUpdate(
        establishmentId,
        { $push: { menu_items: foodItemId } },
        { new: true, runValidators: true }
    );

    return establishment;
}

exports.deleteFoodItem = async (establishmentId, foodItemId) => {
    if (!mongoose.Types.ObjectId.isValid(establishmentId)) {
        throw new Error('Invalid establishment ID');
    }

    if (!mongoose.Types.ObjectId.isValid(foodItemId)) {
        throw new Error('Invalid food item ID');
    }

    const establishment = await Establishment.findByIdAndUpdate(
        establishmentId,
        {
            $pull: {
                menu_items: {
                    _id: new mongoose.Types.ObjectId(foodItemId)
                }
            }
        },
        { 
            new: true,
            runValidators: true 
        }
    );

    if (!establishment) {
        throw new Error('Establishment not found');
    }

    return establishment;
};


exports.getFoodItem = async (establishmentId, foodItemId) => {
    if (!mongoose.Types.ObjectId.isValid(establishmentId)) {
        throw new Error('Invalid establishment ID');
    }

    const establishment = await Establishment.findById(
        establishmentId,
        foodItemId
    );

    return establishment;
}
exports.updateFoodItem = async (establishmentId, foodItemId, foodItem) => {
    if (!mongoose.Types.ObjectId.isValid(establishmentId)) {
        throw new Error('Invalid establishment ID');
    }

    if (!mongoose.Types.ObjectId.isValid(foodItemId)) {
        throw new Error('Invalid food item ID');
    }
    
    // Remove _id from foodItem if it exists to prevent ID changes
    const { _id, ...updateData } = foodItem;

    const establishment = await Establishment.findOneAndUpdate(
        {
            _id: establishmentId,
            'menu_items._id': foodItemId
        },
        {
            $set: {
                'menu_items.$.name': updateData.name,
                'menu_items.$.price': updateData.price,
                'menu_items.$.description': updateData.description,
                'menu_items.$.category': updateData.category,
                // Add other fields as needed
            }
        },
        {
            new: true,
            runValidators: true
        }
    );

    if (!establishment) {
        throw new Error('Establishment or food item not found');
    }

    return establishment;
}