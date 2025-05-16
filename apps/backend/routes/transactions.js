const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

// Store draft transactions in memory (you might want to use Redis or DB in production)
const draftTransactions = new Map();

// Public endpoint to get receipt by transaction ID
router.get('/receipt/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    
    if (!transaction) {
      return res.status(404).json({ message: 'Receipt not found' });
    }

    // Only return necessary receipt information
    const receipt = {
      _id: transaction._id,
      date: transaction.date,
      name: transaction.name,
      mobile: transaction.mobile,
      email: transaction.email,
      planName: transaction.planName,
      receipt: transaction.receipt,
      totalPaidAmount: transaction.totalPaidAmount,
      paymentDetails: {
        paymentMode: transaction.paymentDetails.paymentMode,
        refNo: transaction.paymentDetails.refNo
      }
    };
    
    res.json(receipt);
  } catch (error) {
    console.error('Error fetching receipt:', error);
    res.status(500).json({ message: 'Receipt not found' });
  }
});

// Get transactions by user ID
router.get('/user/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const transactions = await Transaction.find({ userId })
      .sort({ date: -1 }); // Sort by date in descending order
    
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: error.message });
  }
});

// Create new transaction
router.post('/', async (req, res) => {
  try {
    const {
      customerId,
      name,
      mobile,
      email,
      planName,
      totalPaidAmount,
      paymentDetails,
      userId,
      totalPayableAmount,
      receipt
    } = req.body;

    if (!customerId || !totalPaidAmount || !paymentDetails) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    const transaction = new Transaction({
      customerId,
      date: new Date(),
      name,
      mobile,
      email,
      planName,
      totalPaidAmount,
      totalPayableAmount,
      userId,
      receipt,
      paymentDetails: {
        paymentMode: paymentDetails.paymentMode,
        refNo: paymentDetails.refNo
      }
    });

    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ message: error.message });
  }
});

// Create a draft transaction
router.post('/draft', async (req, res) => {
  try {
    const { planName, totalPaidAmount, totalPayableAmount, paymentDetails, receipt } = req.body;

    const draftId = Math.random().toString(36).substring(2, 15);
    const draft = {
      _id: draftId,
      planName,
      totalPaidAmount,
      totalPayableAmount,
      paymentDetails,
      receipt,
      createdAt: new Date(),
    };

    draftTransactions.set(draftId, draft);

    // Auto-cleanup after 1 hour
    setTimeout(() => {
      draftTransactions.delete(draftId);
    }, 3600000);

    res.status(201).json(draft);
  } catch (error) {
    console.error('Error creating draft transaction:', error);
    res.status(500).json({ message: 'Failed to create draft transaction' });
  }
});

// Get a draft transaction
router.get('/draft/:id', (req, res) => {
  const draft = draftTransactions.get(req.params.id);
  if (!draft) {
    return res.status(404).json({ message: 'Draft transaction not found' });
  }
  res.json(draft);
});

// Assign a draft transaction to a customer
router.post('/:id/assign', async (req, res) => {
  try {
    const draft = draftTransactions.get(req.params.id);
    if (!draft) {
      return res.status(404).json({ message: 'Draft transaction not found' });
    }

    const { customerId, name, mobile, email } = req.body;

    const transaction = new Transaction({
      customerId,
      date: new Date(),
      name,
      mobile,
      email,
      planName: draft.planName,
      totalPaidAmount: draft.totalPaidAmount,
      totalPayableAmount: draft.totalPayableAmount,
      paymentDetails: draft.paymentDetails,
      receipt: draft.receipt,
    });

    await transaction.save();

    // Delete the draft after successful assignment
    draftTransactions.delete(req.params.id);

    res.status(201).json(transaction);
  } catch (error) {
    console.error('Error assigning transaction:', error);
    res.status(500).json({ message: 'Failed to assign transaction' });
  }
});

// Get single transaction by ID
router.get('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    res.json(transaction);
  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get all transactions
router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Failed to fetch transactions' });
  }
});

module.exports = router;
