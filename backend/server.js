const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const donorRoutes = require('./routes/donors');
const hospitalRoutes = require('./routes/hospitals');
const db = require('./models');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/donors', donorRoutes);
app.use('/api/hospitals', hospitalRoutes);

// Check database connection before syncing
db.sequelize.authenticate()
  .then(() => {
    console.log('✅ Database connected successfully.');
    return db.sequelize.sync({ alter: true }); // Updates tables without deleting data
  })
  .then(() => {
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  })
  .catch(err => console.error('❌ Database connection failed:', err));
