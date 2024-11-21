/**
 * Cleans and parses JSON string by removing comments and extra whitespace
 * @param {string} jsonString - The raw JSON string to clean
 * @returns {Object} Parsed JSON object
 * @throws {Error} If JSON parsing fails
 */
const cleanAndParseJson = (jsonString) => {
    if (!jsonString) {
        throw new Error('JSON string is required');
    }

    // Clean the JSON string
    const cleanJsonString = jsonString
        .replace(/\/\/.*$/gm, '')     // Remove single-line comments
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
        .replace(/\n\s*/g, '')        // Remove newlines and extra spaces
        .replace(/,\s*}/g, '}')       // Remove trailing commas in objects
        .replace(/,\s*\]/g, ']')      // Remove trailing commas in arrays
        .trim();                      // Remove leading/trailing whitespace

    try {
        return JSON.parse(cleanJsonString);
    } catch (error) {
        throw new Error(`Invalid JSON format: ${error.message}`);
    }
};

module.exports = {
    cleanAndParseJson
};