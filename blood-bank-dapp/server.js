const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 5000;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'blood_bank',
  password: 'aryan@123',
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

app.use(cors());
app.use(express.json());

// Fetch all donors
app.get('/api/donors', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM donors');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching donors:', err.message);
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