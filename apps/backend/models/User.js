const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Basic Info
  name: { type: String, required: true },
  email: { type: String },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  fatherSpouseName: { type: String },
  mobile: { type: String, required: true, unique: true },
  alternateContact: { type: String },

  // Address Details
  address: { type: String },
  landmark: { type: String },
  city: { type: String },
  pincode: { type: String },
  country: { type: String },
  state: { type: String },
  district: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },

  // Document Details
  aadhaarNumber: { type: String, required: true },
  aadhaarFrontImage: { type: String, required: true },  // URL to stored image
  aadhaarBackImage: { type: String, required: true },   // URL to stored image
  customerId: { type: String, required: true, unique: true },

  // Installation Details
  modelInstalled: { type: String },
  serialNumber: { type: String },
  installationDate: { type: Date },
  installationTime: { type: String },
  flowSensorId: { type: String },
  tdsBefore: { type: Number },
  tdsAfter: { type: Number },

  // Payment Details
  planSelected: { type: String },
  securityDeposit: { type: Number },
  paymentMode: { type: String },

  // Signatures and Verification
  customerSignature: { type: String },  // URL to signature image
  installerName: { type: String },
  installerContact: { type: String },
  installerSignature: { type: String }, // URL to signature image
  installationDateTime: { type: Date },

  token: {
    type: String,
    default: null
  },
  tokenExpires: {
    type: Date,
    default: null
  }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
