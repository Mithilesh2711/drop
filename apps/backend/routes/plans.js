const express = require('express');
const router = express.Router();
const Plan = require('../models/Plan');

// Get all plans
router.get('/', async (req, res) => {
  try {
    console.log('Fetching plans from database...');
    const plans = await Plan.find().sort({ createdAt: -1 });
    console.log('Found plans:', plans);
    res.json(plans);
  } catch (err) {
    console.error('Error fetching plans:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get plan by ID
router.get('/:id', async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }
    res.json(plan);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create plan
router.post('/', async (req, res) => {
  try {
    const { name, description, monthlyCharge, securityDeposit, features, status } = req.body;

    // Check if plan with same name exists
    const existingPlan = await Plan.findOne({ name });
    if (existingPlan) {
      return res.status(400).json({ message: 'Plan with this name already exists' });
    }

    // Create new plan
    const plan = new Plan({
      name,
      description,
      monthlyCharge,
      securityDeposit,
      features: features || [],
      status: status || 'active'
    });

    // Save plan
    const savedPlan = await plan.save();
    res.status(201).json(savedPlan);
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Plan with this name already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Update plan
router.put('/:id', async (req, res) => {
  try {
    const { name, description, monthlyCharge, securityDeposit, features, status } = req.body;

    // Check if plan with same name exists (excluding current plan)
    const existingPlan = await Plan.findOne({ name, _id: { $ne: req.params.id } });
    if (existingPlan) {
      return res.status(400).json({ message: 'Plan with this name already exists' });
    }

    const plan = await Plan.findByIdAndUpdate(
      req.params.id,
      { name, description, monthlyCharge, securityDeposit, features, status },
      { new: true }
    );
    
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }
    res.json(plan);
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Plan with this name already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete plan
router.delete('/:id', async (req, res) => {
  try {
    const plan = await Plan.findByIdAndDelete(req.params.id);
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }
    res.json({ message: 'Plan deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
