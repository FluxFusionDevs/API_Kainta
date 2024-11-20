const mongoose = require('mongoose');
const coordinatesSchema = require('./locationModel');
const ratingSchema = require('./ratingModel');
const foodSchema = require('./foodModel');
const logger = require('../utils/logger');
const User = require('./userModel');
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
    menu_items: [foodSchema],
    contact_number: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    barangay: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Barangay',
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
    }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['PENDING', 'APPROVED', 'REJECTED'],
        default: 'PENDING'
    }
}, {
    timestamps: true
});

// Pre-save middleware to verify owner status
establishmentSchema.pre('save', async function(next) {
    try {
        const owner = await User.findById(this.owner);
        
        if (!owner) {
            throw new Error('Owner not found');
        }

        if (!owner.premium && !owner.trial) {
            throw new Error('Owner must have a premium subscription or be in free trial period');
        }
        await User.findByIdAndUpdate(this.owner, {
            owned_establishment: this._id
        });
        next();
    } catch (error) {
        logger.error(error);
        next(error);
    }
});

// Pre findOneAndDelete middleware
establishmentSchema.pre('findOneAndDelete', async function(next) {
    try {
        const User = mongoose.model('User');
        const establishment = await this.model.findOne(this.getQuery());
        
        if (establishment) {            
            // Update (not delete) the user to remove establishment reference
            await User.findByIdAndUpdate(establishment.owner, {
                owned_establishment: null
            });
        }
        next();
    } catch (error) {
        logger.error('Error in establishment pre-delete middleware:', error);
        next(error);
    }
});

// establishmentSchema.pre('findOneAndUpdate', async function(next) {
//     try {
//         const establishment = await this.model.findOne(this.getQuery());
        
//         // If owner is being changed
//         if (this._update.owner && establishment.owner.toString() !== this._update.owner.toString()) {
//             // Remove establishment reference from old owner
//             await User.findByIdAndUpdate(establishment.owner, {
//                 owned_establishment: null
//             });
            
//             // Add establishment reference to new owner
//             await User.findByIdAndUpdate(this._update.owner, {
//                 owned_establishment: establishment._id
//             });
//         }
        
//         next();
//     } catch (error) {
//         logger.error(error);
//         next(error);
//     }
// });

// Index for location-based queries
establishmentSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Establishment', establishmentSchema);
