const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Budget = sequelize.define('Budget', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  monthlyLimit: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  month: { type: DataTypes.INTEGER, allowNull: false }, // 1 - 12
  year: { type: DataTypes.INTEGER, allowNull: false },
});

module.exports = Budget;
