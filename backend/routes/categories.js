const express = require('express');
const router = express.Router();

const categories = ['Food', 'Rent', 'Utilities', 'Transportation', 'Entertainment', 'Uncategorized'];

// Get Categories
router.get('/', (req, res) => {
  res.json(categories);
});

// Add Category
router.post('/', (req, res) => {
  const { category } = req.body;
  if (!category || categories.includes(category)) {
    return res.status(400).json({ error: 'Invalid or duplicate category' });
  }
  categories.push(category);
  res.status(201).json(categories);
});

module.exports = router;