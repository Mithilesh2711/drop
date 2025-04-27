const express = require('express');
const router = express.Router();
const LocationCode = require('../models/LocationCode');
const CustomerIdCounter = require('../models/CustomerIdCounter');

// Get all locations
router.get('/', async (req, res) => {
  try {
    const locations = await LocationCode.find().lean();
    res.json(locations);
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({ message: 'Failed to fetch locations' });
  }
});

// Get all pincodes
router.get('/pincodes', async (req, res) => {
  try {
    const pincodes = await LocationCode.find({}, 'pincode state district city').lean();
    res.json(pincodes);
  } catch (error) {
    console.error('Error fetching pincodes:', error);
    res.status(500).json({ message: 'Failed to fetch pincodes' });
  }
});

// Get location details by pincode
router.get('/location/:pincode', async (req, res) => {
  try {
    const { pincode } = req.params;
    const location = await LocationCode.findOne({ pincode });
    
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    
    res.json(location);
  } catch (error) {
    console.error('Error fetching location:', error);
    res.status(500).json({ message: 'Failed to fetch location' });
  }
});

// Generate customer ID based on pincode
router.post('/generate-customer-id', async (req, res) => {
  try {
    const { pincode } = req.body;
    
    if (!pincode) {
      return res.status(400).json({ message: 'Pincode is required' });
    }
    
    // Find location by pincode
    let location = await LocationCode.findOne({ pincode });
    
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    
    // Generate customer ID
    const stateCode = location.state.substring(0, 2).toUpperCase();
    const districtCode = location.districtCode;
    const divisionCode = pincode.slice(-3); // Use last 3 characters of pincode
    
    // Find or create counter for this combination
    let counter = await CustomerIdCounter.findOne({
      stateCode,
      districtCode,
      divisionCode
    });

    if (!counter) {
      counter = new CustomerIdCounter({
        stateCode,
        districtCode,
        divisionCode,
        counter: 1
      });
    } else {
      counter.counter += 1;
    }
    await counter.save();

    // Generate customer ID with the format: ST-DD-DIV-XXXX
    const customerId = `${stateCode}-${districtCode}-${divisionCode}-${counter.counter.toString().padStart(4, '0')}`;
    
    res.json({ customerId });
  } catch (error) {
    console.error('Error generating customer ID:', error);
    res.status(500).json({ message: 'Failed to generate customer ID' });
  }
});

// Admin routes for managing location codes
// Add a new location
router.post('/admin/locations', async (req, res) => {
  try {
    const { pincode, state, district, city, districtCode } = req.body;
    
    if (!pincode || !state || !district || !city || !districtCode) {
      return res.status(400).json({ message: 'Pincode, state, district, city, and district code are required' });
    }
    
    const existingLocation = await LocationCode.findOne({ pincode });
    if (existingLocation) {
      return res.status(400).json({ message: 'Pincode already exists' });
    }
    
    const newLocation = new LocationCode({
      pincode,
      state,
      district,
      city,
      districtCode,
      counter: 0
    });
    
    await newLocation.save();
    res.status(201).json(newLocation);
  } catch (error) {
    console.error('Error adding location:', error);
    res.status(500).json({ message: 'Failed to add location' });
  }
});

// Update a location
router.put('/admin/locations', async (req, res) => {
  try {
    const { pincode, state, district, city, districtCode } = req.body;
    
    if (!pincode) {
      return res.status(400).json({ message: 'Pincode is required' });
    }
    
    const location = await LocationCode.findOne({ pincode });
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    
    // Update fields if provided
    if (state) location.state = state;
    if (district) location.district = district;
    if (city) location.city = city;
    if (districtCode) location.districtCode = districtCode;
    
    await location.save();
    res.json(location);
  } catch (error) {
    console.error('Error updating location:', error);
    res.status(500).json({ message: 'Failed to update location' });
  }
});

// Delete a location
router.delete('/admin/locations', async (req, res) => {
  try {
    const { pincode } = req.body;
    
    if (!pincode) {
      return res.status(400).json({ message: 'Pincode is required' });
    }
    
    const location = await LocationCode.findOne({ pincode });
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    
    await LocationCode.deleteOne({ pincode });
    res.json({ message: 'Location deleted successfully' });
  } catch (error) {
    console.error('Error deleting location:', error);
    res.status(500).json({ message: 'Failed to delete location' });
  }
});

module.exports = router; 