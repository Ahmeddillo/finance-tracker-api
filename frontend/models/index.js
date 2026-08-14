const User = require('./User');
const Category = require('./Category');
const Transaction = require('./Transaction');
const Budget = require('./Budget');

// User - Category (Kullanıcıya özel veya genel kategoriler)
User.hasMany(Category, { foreignKey: 'userId', onDelete: 'CASCADE' });
Category.belongsTo(User, { foreignKey: 'userId' });

// User - Transaction
User.hasMany(Transaction, { foreignKey: 'userId', onDelete: 'CASCADE' });
Transaction.belongsTo(User, { foreignKey: 'userId' });

// Category - Transaction
Category.hasMany(Transaction, { foreignKey: 'categoryId', onDelete: 'SET NULL' });
Transaction.belongsTo(Category, { foreignKey: 'categoryId' });

// User & Category - Budget
User.hasMany(Budget, { foreignKey: 'userId', onDelete: 'CASCADE' });
Budget.belongsTo(User, { foreignKey: 'userId' });

Category.hasMany(Budget, { foreignKey: 'categoryId', onDelete: 'CASCADE' });
Budget.belongsTo(Category, { foreignKey: 'categoryId' });

module.exports = { User, Category, Transaction, Budget };
