const mongoose = require('mongoose');
const LocationCode = require('../models/LocationCode');

// Sample pincode data
const samplePincodes = [
  {
    pincode: '110001',
    state: 'Delhi',
    district: 'Central Delhi',
    city: 'New Delhi',
    counter: 0
  },
  {
    pincode: '400001',
    state: 'Maharashtra',
    district: 'Mumbai',
    city: 'Mumbai',
    counter: 0
  },
  {
    pincode: '700001',
    state: 'West Bengal',
    district: 'Kolkata',
    city: 'Kolkata',
    counter: 0
  },
  {
    pincode: '600001',
    state: 'Tamil Nadu',
    district: 'Chennai',
    city: 'Chennai',
    counter: 0
  },
  {
    pincode: '560001',
    state: 'Karnataka',
    district: 'Bangalore',
    city: 'Bangalore',
    counter: 0
  }
];

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/drop')
  .then(() => {
    console.log('Connected to MongoDB');
    
    // Clear existing data
    return LocationCode.deleteMany({});
  })
  .then(() => {
    console.log('Cleared existing location codes');
    
    // Insert sample data
    return LocationCode.insertMany(samplePincodes);
  })
  .then((result) => {
    console.log(`Inserted ${result.length} pincode records`);
    return mongoose.disconnect();
  })
  .then(() => {
    console.log('Disconnected from MongoDB');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error seeding pincode data:', error);
    process.exit(1);
  }); 