const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

// Enable pre-flight requests for all routes
app.options('*', cors());

app.use(cookieParser());
// Increase JSON body size limit to 50mb
app.use(express.json({ limit: '50mb' }));
// Increase URL-encoded body size limit to 50mb
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const locationRoutes = require('./routes/locationCodes');
const uploadRoutes = require('./routes/upload');
const planRoutes = require('./routes/plans');
const transactionRoutes = require('./routes/transactions');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/location-codes', locationRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/transactions', transactionRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
