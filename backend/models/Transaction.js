const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  description: { type: String, required: true },
  category: { type: String, default: 'Uncategorized' },
});

module.exports = mongoose.model('Transaction', transactionSchema);