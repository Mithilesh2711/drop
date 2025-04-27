const mongoose = require("mongoose");

const ReceiptItemSchema = new mongoose.Schema({
  headName: { type: String, enum: ["Security Deposit", "Rent"], required: true },
  headAmount: { type: Number, required: true },
});

const PaymentDetailsSchema = new mongoose.Schema({
  paymentMode: { type: String, required: true },
  refNo: { type: String},
});

const TransactionSchema = new mongoose.Schema({
  customerId: { type: String, required: true },
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  date: { type: Date, required: true },
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String },
  planName: { type: String, required: true },
  totalPaidAmount: { type: Number, required: true },
  totalPayableAmount: { type: Number, required: true },
  paymentDetails: {
    paymentMode: { type: String, required: true },
    refNo: { type: String },
  },
  receipt: [{
    headName: { type: String, required: true },
    headAmount: { type: Number, required: true }
  }]
});

module.exports = mongoose.models.Transaction || mongoose.model("Transaction", TransactionSchema);