const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'blood_bank',
  password: 'aryan@123', // Replace with your actual database password
  port: 5432,
});

// Test the database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Database connected:', res.rows);
  }
});

// API endpoint to fetch all donors
app.get('/api/donors', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM donors');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching donors:', err);
    res.status(500).send('Server error');
  }
});

// API endpoint to fetch all hospitals
app.get('/api/hospitals', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM hospitals');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching hospitals:', err);
    res.status(500).send('Server error');
  }
});

// API endpoint to fetch blood availability
app.get('/api/blood-availability', async (req, res) => {
  try {
    const result = await pool.query('SELECT blood_type, COUNT(*) as count FROM donors GROUP BY blood_type');
    const bloodAvailability = {};
    result.rows.forEach(row => {
      bloodAvailability[row.blood_type] = parseInt(row.count, 10);
    });
    res.json(bloodAvailability);
  } catch (err) {
    console.error('Error fetching blood availability:', err);
    res.status(500).send('Server error');
  }
});

// Register a donor
app.post('/api/donors/register', async (req, res) => {
  const { name, age, blood_type, location } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO donors (name, age, blood_type, location) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, age, blood_type, location]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error registering donor:', err.message);
    res.status(500).send('Server error');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});