const mongoose = require("mongoose");

const barangaySchema = new mongoose.Schema({
    name: String,
    image: String,
});

module.exports = mongoose.model("Barangay", barangaySchema);
