const mongoose = require('mongoose');

const locationCodeSchema = new mongoose.Schema({
  pincode: { type: String, required: true, unique: true },
  state: { type: String, required: true },
  district: { type: String, required: true },
  districtCode: { type: String, required: true },
  city: { type: String, required: true },
  counter: { type: Number, default: 0 }
}, { timestamps: true });

// Create a compound index to ensure uniqueness of state and district code combination
locationCodeSchema.index({ pincode: 1 }, { unique: true });

module.exports = mongoose.model('LocationCode', locationCodeSchema); 