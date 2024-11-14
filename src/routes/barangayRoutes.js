const express = require("express");
const router = express.Router();
const barangayController = require("../controllers/barangayController");

router.get("/get-barangays", barangayController.getBarangays);
router.post("/create-barangays", barangayController.createBarangays);

module.exports = router;

