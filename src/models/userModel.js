const mongoose = require('mongoose');
const { generateActivationCode } = require('../utils/activation_code_generator');
const logger = require('../utils/logger');
const userSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true
    },
    name: {
        type: String,
        required: true
    },
    avatar: {
        type: String  // URI for the avatar
    },
    type: {
        type: String,
        enum: ['ADMIN', 'OWNER', 'USER'],  // Add your UserTypes here
        required: true
    },
    email_type: {
        type: String,
        enum: ['GOOGLE', 'EMAIL', 'APPLE'],
        required: true
    },
    owned_establishment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Establishment',  // If you have an Establishment model
        default: null
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    password: {
        type: String,
        required: function() {
            return this.account_type === 'EMAIL'; // Required only if account_type is EMAIL
        }
    },
    favorite_establishments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Establishment'
    }],
    trial: {
        type: Boolean,
        default: false
    },
    premium: {
        type: Boolean,
        default: false
    },
    trial_exp_date: {
        type: Date,
        default: null
    },
    premium_exp_date: {
        type: Date,
        default: null
    },
    activation_code: {
        type: String,
        default: function() {
            return this.account_type === 'EMAIL' ? generateActivationCode() : null;
        }
    },
    activation_code_exp_date: {
        type: Date,
        default: function() {
            return this.account_type === 'EMAIL' ? () => new Date(+new Date() + 5 * 60 * 1000) : null;
        }
    },
    activated: {
        type: Boolean,
        default: function() {
            return this.account_type !== 'EMAIL'; // Set to true if account_type is not EMAIL
        }
    }
}, {
    timestamps: true  // Adds createdAt and updatedAt
});

userSchema.pre('findOneAndUpdate', async function(next) {
    const update = this.getUpdate();
    if (update.$set?.trial === true && !update.$set?.trial_exp_date) {  // Check inside $set operator
        this.setUpdate({
            ...update,
            $set: {
                ...update.$set,
                trial_exp_date: new Date(+new Date() + 7 * 24 * 60 * 60 * 1000),
                type: 'OWNER'
            }
        });
    }
    next();
});

userSchema.pre('save', function(next) {
    if (this.account_type !== 'EMAIL') {
        this.activation_code = null;
        this.activation_code_exp_date = null;
        this.activated = true; // Set activated to true if account_type is not EMAIL
    }
    next();
});

module.exports = mongoose.model('User', userSchema);