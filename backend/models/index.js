const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const db = {};

// Initialize models
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.Donor = require('./Donor')(sequelize, DataTypes);
db.Hospital = require('./Hospital')(sequelize, DataTypes);

module.exports = db;
