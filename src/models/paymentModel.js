const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ["gcash", "bank_transfer"],
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    required: true,
  },
  proofOfPayment: {
    type: String,
    required: true,
  },
}, {
    timestamps: true
});

module.exports = mongoose.model("Payment", paymentSchema);
