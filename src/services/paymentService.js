const { Payment, PAYMENT_TYPE } = require("../models/paymentModel");
const logger = require("../utils/logger");

exports.createPayment = async (paymentData) => {
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

