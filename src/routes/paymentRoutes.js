const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const { createUploadMiddleware } = require("../middleware/upload");

const renderPath = process.env.RENDER_UPLOAD_PATH;
const renderUploadPath = process.env.NODE_ENV === "development" ? `${renderPath}/uploads/payments` : "uploads/payments";

const uploadDocument = createUploadMiddleware({
  fields: [
    {
      directory: renderUploadPath,
      filePrefix: "payment",
      fieldName: "paymentImage",
      maxSize: 5 * 1024 * 1024, // 5MB
    },
  ],
});

router.post("/subscribe-trial", paymentController.subscribeTrial);
router.post(
  "/subscribe-premium",
  uploadDocument,
  paymentController.subscribePremium
);

router.get("/get-all-payments", paymentController.getAllPayments);

router.put("/update-status", paymentController.updatePaymentStatus);

module.exports = router;
