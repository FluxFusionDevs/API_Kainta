const paymentService = require("../services/paymentService");
const logger = require("../utils/logger");
const { PAYMENT_TYPE } = require("../models/paymentModel");
const  userService  = require("../services/userService");

exports.subscribeTrial = async (req, res, next) => {
  try {
    // Add TRIAL type to payment data
    console.log("Request Body", req.body);
    const paymentData = req.body;
    if (!paymentData.user && !paymentData.type) {
      return res.status(400).json({
        message: "Payment data is required",
      });
    }
    const payment = await paymentService.createPayment(paymentData);
    const user = await userService.updateUserSubscription(paymentData.user);

    res.status(201).json({payment, user});
  } catch (error) {
    logger.error("Error creating trial subscription:", error);
    next(error);
  }
};

exports.subscribePremium = async (req, res, next) => {
  try {
    console.log("Request Body", req.body);
    // Validate required fields for premium
    if (!req.body.amount || !req.body.paymentMethod || !req.uploadedFile) {
      logger.warn("Missing required fields for premium subscription");
      return res.status(400).json({
        message:
          "Amount, payment method, and proof of payment are required for premium subscription",
      });
    }

    const paymentData = {
      ...req.body,
      type: PAYMENT_TYPE.PREMIUM,
      proofOfPayment: req.uploadedFile.paymentImage.path
    };

    logger.info("Creating premium subscription:", paymentData);

    const payment = await paymentService.createPayment(paymentData);

    logger.info("Premium subscription created successfully:", payment._id);
    res.status(201).json(payment);
  } catch (error) {
    logger.error("Error creating premium subscription:", error);
    next(error);
  }
};

exports.getAllPayments = async (req, res, next) => {
  try {
    const status = req.query.status;
    const payments = status 
      ? await paymentService.getAllPayments(status)
      : await paymentService.getAllPayments();
      
    res.status(200).json(payments);
  } catch (error) {
    next(error);
  }
};

exports.updatePaymentStatus = async (req, res, next) => {
  try {
    const payment = await paymentService.updatePaymentStatus(req.body);
    res.status(200).json(payment);
  } catch (error) {
    next(error);
  }
};
