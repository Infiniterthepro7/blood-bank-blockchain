const express = require('express');
const router = express.Router();
const db = require('../models');
const Hospital = db.Hospital;

// Register a hospital
router.post('/register', async (req, res) => {
  const { name, location, contact } = req.body;
  try {
    const hospital = await Hospital.create({ name, location, contact });
    res.status(201).send(hospital);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get hospital details
router.get('/:id', async (req, res) => {
  try {
    const hospital = await Hospital.findByPk(req.params.id);
    res.send(hospital);
  } catch (error) {
    res.status(404).send(error);
  }
});

// Get all hospitals
router.get('/', async (req, res) => {
  try {
    const hospitals = await Hospital.findAll();
    res.send(hospitals);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;