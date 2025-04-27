const mongoose = require('mongoose');

const customerIdCounterSchema = new mongoose.Schema({
  stateCode: { type: String, required: true },
  districtCode: { type: String, required: true },
  divisionCode: { type: String, required: true },
  counter: { type: Number, default: 1 },
  lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

// Create a compound index to ensure uniqueness of state, district, and division code combination
customerIdCounterSchema.index({ stateCode: 1, districtCode: 1, divisionCode: 1 }, { unique: true });

module.exports = mongoose.model('CustomerIdCounter', customerIdCounterSchema); 