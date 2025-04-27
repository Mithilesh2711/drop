const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const CustomerIdCounter = require('../models/CustomerIdCounter');
const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');



// Register
router.post('/register', async (req, res) => {
  try {
    const { 
      name, 
      mobile, 
      aadhaarNumber, 
      aadhaarFrontUrl, 
      aadhaarBackUrl,
      customerSignature,
      installerSignature,
      state,
      city,
      pincode,
      // ... other fields
    } = req.body;

    // Validate required fields
    if (!mobile) {
      return res.status(400).json({ message: 'Mobile number is required' });
    }
    
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    if (!req.body.customerId) {
      return res.status(400).json({ message: 'Customer ID is required' });
    }

    // Check if user exists by mobile
    const existingUser = await User.findOne({ mobile });

    if (existingUser) {
      return res.status(400).json({ message: 'Mobile number already registered' });
    }

    // Generate a random password if not provided
    const password = req.body.password || req.body.mobile;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate customer ID if state, city, and pincode are provided
    let customerId = null;
    if (state && city && pincode) {
      try {
        // Extract state code and city code from the state and city names
        // This is a simplified approach - in a real app, you would have a mapping table
        const stateCode = state.substring(0, 2).toUpperCase();
        const cityCode = city.substring(0, 2).toUpperCase();
        const divisionCode = pincode.substring(0, 3);
        
        // Find or create counter for this state, city, and division
        let counter = await CustomerIdCounter.findOne({
          stateCode,
          cityCode,
          divisionCode
        });
        
        if (!counter) {
          // Create new counter if it doesn't exist
          counter = new CustomerIdCounter({
            stateCode,
            cityCode,
            divisionCode,
            counter: 1
          });
        } else {
          // Increment counter
          counter.counter += 1;
          counter.lastUpdated = new Date();
        }
        
        await counter.save();
        
        // Format customer ID: stateCode + cityCode + divisionCode + 4-digit counter
        customerId = `${stateCode}${cityCode}${divisionCode}${counter.counter.toString().padStart(4, '0')}`;
      } catch (error) {
        console.error('Error generating customer ID:', error);
        // Continue without customer ID if there's an error
      }
    }

    // Create user with all fields from request body
    const userData = {
      ...req.body,
      password: hashedPassword,
      role: 'user',
      installationDateTime: new Date(), // Set current date/time for installation
      // Store URLs for images
      aadhaarFrontImage: aadhaarFrontUrl,
      aadhaarBackImage: aadhaarBackUrl,
      customerSignature: customerSignature,
      installerSignature: installerSignature,
      customerId: req.body.customerId // Use the customer ID from the frontend
    };

    // Create user
    const user = new User(userData);
    await user.save();

    // Create a transaction for the new user
    try {
      const securityDeposit = req.body.securityDeposit || 0;
      const totalAmount = securityDeposit;
      const paymentMode = req.body.paymentMode || 'Cash';
      const refNo = req.body.paymentRefNo || "";

      await Transaction.create({
        customerId: user.customerId,
        userId: user._id,
        name: user.name,
        date: new Date(),
        planName: req.body.planName || "Standard Plan",
        receipt: [
          { headName: "Security Deposit", headAmount: securityDeposit },
        ],
        totalPaidAmount: totalAmount,
        totalPayableAmount: totalAmount,
        paymentDetails: {
          paymentMode: paymentMode,
          refNo: refNo
        },
        email: user.email || "",
        mobile: user.mobile
      });
    } catch (txnErr) {
      console.error("Failed to create transaction for new user:", txnErr);
    }

    // Create token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1d' }
    );

    res.status(201).json({ 
      token,
      message: 'Registration successful',
      userId: user._id,
      customerId: user.customerId
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed. Please try again.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { mobile, password } = req.body;
    console.log(mobile, password);
    // Validate request body
    if (!mobile || !password) {
      return res.status(400).json({ message: 'Mobile number and password are required' });
    }

    // Check if user exists
    const user = await User.findOne({ mobile });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if user is already logged in with a valid token
    if (user.token && user.tokenExpires && new Date(user.tokenExpires) > new Date()) {
      return res.status(400).json({ message: 'User already logged in. Please logout first.' });
    }

    // Check password using the comparePassword method
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1d' }
    );

    // Update user with token and expiry
    const tokenExpires = new Date();
    tokenExpires.setDate(tokenExpires.getDate() + 1); // 1 day from now

    user.token = token;
    user.tokenExpires = tokenExpires;
    await user.save();

    // Set token as HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      path: '/',
      domain: 'localhost'
    });

    res.json({ 
      message: 'Login successful',
      userId: user._id,
      role: user.role,
      customerId: user.customerId,
      redirect: '/dashboard'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed. Please try again.' });
  }
});

// Logout
router.post('/logout', async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    // Find user and clear token
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.token = null;
    user.tokenExpires = null;
    await user.save();
    
    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Logout failed. Please try again.' });
  }
});

module.exports = router;
