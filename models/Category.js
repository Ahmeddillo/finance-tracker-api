const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: { type: DataTypes.STRING, allowNull: false },
  type: {
    type: DataTypes.ENUM('income', 'expense'),
    allowNull: false,
  },
  color: { type: DataTypes.STRING, defaultValue: '#3B82F6' }, // Grafiklerde kullanılacak renk kodu
  icon: { type: DataTypes.STRING, defaultValue: 'Tag' },
});

module.exports = Category;
