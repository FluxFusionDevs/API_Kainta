const establishmentService = require("../services/establishmentService");
const axios = require("axios");
exports.getEstablishments = async (req, res, next) => {
    try {
        const establishments = await establishmentService.getEstablishments();
        res.json(establishments);
    } catch (error) {
        next(error);
    }
}

exports.getEstablishmentById = async (req, res, next) => {
    try {
        const establishment = await establishmentService.getEstablishmentById(req.params.id);
        res.json(establishment);
    } catch (error) {
        next(error);
    }
}

exports.createEstablishment = async (req, res, next) => {
    try {
        const establishment = await establishmentService.createEstablishment(req.body);
        res.status(201).json(establishment);
    } catch (error) {
        next(error);
    }
}

exports.updateEstablishment = async (req, res, next) => {
    try {
        const updatedEstablishment = await establishmentService.updateEstablishment(req.body);
        res.json(updatedEstablishment);
    } catch (error) {
        next(error);
    }
}


exports.getBarangays = async (req, res) => {
    try {
        const response = await axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json`, {
            params: {
                query: "barangays in Cainta Rizal Philippines",
                key: process.env.GOOGLE_MAPS_API_KEY
            }
        });

        const barangays = response.data.results.map(place => place.name); // Extracting barangay names
        res.status(200).json(barangays);
    } catch (error) {
        console.error("Error fetching barangays:", error);
        res.status(500).json({ error: "Failed to fetch barangays" });
    }
};
