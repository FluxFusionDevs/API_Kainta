const { Payment, PAYMENT_TYPE } = require("../models/paymentModel");
const logger = require("../utils/logger");
const User = require('../models/userModel');

exports.createPayment = async (paymentData) => {
  // Check if the user has a trial_exp_date
  const user = await User.findById(paymentData.user);
  if (user.trial_exp_date) {
    throw new Error('ALREADY HAS TRIAL');
  }

  if (user.premium_exp_date) {
    throw new Error('ALREADY HAS PREMIUM');
  }

  // Create new payment instance
  const payment = new Payment(paymentData);
  
  // Save the payment
  const savedPayment = await payment.save();

  // Populate user details if needed
  return await savedPayment.populate("user");
};

exports.getAllPayments = async (status = null) => {
    const query = status ? { status } : {};
    return await Payment.find(query)
      .populate({
        path: 'user',
        populate: {
          path: 'owned_establishment'
        }
      });
};

exports.updatePaymentStatus = async (paymentData) => {
  return await Payment.findByIdAndUpdate(paymentData._id, { status: paymentData.status });
};

