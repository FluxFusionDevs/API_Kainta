const mongoose = require("mongoose");

const barangaySchema = new mongoose.Schema({
    name: String,
});

module.exports = mongoose.model("Barangay", barangaySchema);
