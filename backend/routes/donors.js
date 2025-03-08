const express = require('express');
const router = express.Router();
const db = require('../models');
const Donor = db.Donor;

// Register a donor
router.post('/register', async (req, res) => {
  const { name, age, bloodType, location } = req.body;
  try {
    const donor = await Donor.create({ name, age, bloodType, location, isAvailable: true });
    res.status(201).json(donor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get donor details
router.get('/:id', async (req, res) => {
  try {
    const donor = await Donor.findByPk(req.params.id);
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }
    res.json(donor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all donors
router.get('/', async (req, res) => {
  try {
    const donors = await Donor.findAll();
    res.json(donors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
