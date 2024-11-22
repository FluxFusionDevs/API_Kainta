const mongoose = require('mongoose');

const PAYMENT_TYPE = {
    TRIAL: 'TRIAL',
    PREMIUM: 'PREMIUM'
};

const PAYMENT_STATUS = {
    PENDING: 'PENDING',
    COMPLETED: 'COMPLETED',
    FAILED: 'FAILED'
};

const PAYMENT_METHOD = {
    GCASH: 'GCASH',
    BANK_TRANSFER: 'BANK_TRANSFER',
    CREDIT_CARD: 'CREDIT_CARD'
};

const paymentSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: Object.values(PAYMENT_TYPE),
        required: true
    },
    amount: {
        type: Number,
        required: function() {
            return this.type !== PAYMENT_TYPE.TRIAL;
        },
        min: 0
    },
    paymentMethod: {
        type: String,
        enum: Object.values(PAYMENT_METHOD),
        required: function() {
            return this.type !== PAYMENT_TYPE.TRIAL;
        }
    },
    status: {
        type: String,
        enum: Object.values(PAYMENT_STATUS),
        required: true,
        default: PAYMENT_STATUS.PENDING
    },
    proofOfPayment: {
        type: String,
        required: function() {
            return this.type !== PAYMENT_TYPE.TRIAL;
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

paymentSchema.pre(['updateOne', 'findOneAndUpdate'], function(next) {
  this.setOptions({ runValidators: true });
  next();
});

// Pre-save middleware to handle TRIAL type payments
paymentSchema.pre('save', function(next) {
    if (this.type === PAYMENT_TYPE.TRIAL) {
        this.status = PAYMENT_STATUS.COMPLETED;
        this.amount = 0;
        this.paymentMethod = undefined;
        this.proofOfPayment = undefined;
    }
    next();
});

module.exports = {
    Payment: mongoose.model('Payment', paymentSchema),
    PAYMENT_TYPE,
    PAYMENT_STATUS,
    PAYMENT_METHOD
};