const barangayService = require("../services/barangayService");
const logger = require("../utils/logger");


exports.getBarangays = async (req, res) => {
    try {
        const barangays = await barangayService.getBarangays();
        res.json(barangays);
    } catch (error) {
        logger.error(error);
        next(error);
    }
}

exports.createBarangays = async (req, res) => {
    const barangayNames = req.body; // Expecting an array of strings

    if (!Array.isArray(barangayNames)) {
        return res.status(400).json({ error: "Input must be an array of barangay names." });
    }

    try {
        const barangays = await barangayService.createBarangays(barangayNames);
        res.status(201).json(barangays);
    } catch (error) {
        logger.error(error);
        next(error);
    }
};

