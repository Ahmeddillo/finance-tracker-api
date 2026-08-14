const { Transaction, Category } = require('../models');
const { sequelize } = require('../config/db');
const { Op } = require('sequelize');

// 1. Yeni İşlem Ekleme
const createTransaction = async (req, res) => {
  try {
    const { amount, type, date, description, categoryId } = req.body;
    const transaction = await Transaction.create({
      amount,
      type,
      date: date || new Date(),
      description,
      categoryId,
      userId: req.user.id,
    });
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. İşlem Listesi (Filtreleme & Sayfalama)
const getTransactions = async (req, res) => {
  try {
    const { type, categoryId, startDate, endDate, page = 1, limit = 10 } = req.query;
    const where = { userId: req.user.id };

    if (type) where.type = type;
    if (categoryId) where.categoryId = categoryId;
    if (startDate && endDate) {
      where.date = { [Op.between]: [startDate, endDate] };
    }

    const offset = (page - 1) * limit;
    const { count, rows } = await Transaction.findAndCountAll({
      where,
      include: [{ model: Category, attributes: ['id', 'name', 'color', 'icon'] }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['date', 'DESC']],
    });

    res.json({ total: count, pages: Math.ceil(count / limit), currentPage: parseInt(page), data: rows });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Ozet Kartları Data (Toplam Gelir, Toplam Gider, Net Bakiye)
const getSummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const summary = await Transaction.findAll({
      where: { userId },
      attributes: [
        'type',
        [sequelize.fn('SUM', sequelize.col('amount')), 'totalAmount'],
      ],
      group: ['type'],
      raw: true,
    });

    let totalIncome = 0;
    let totalExpense = 0;

    summary.forEach(item => {
      if (item.type === 'income') totalIncome = parseFloat(item.totalAmount);
      if (item.type === 'expense') totalExpense = parseFloat(item.totalAmount);
    });

    res.json({
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. Kategori Bazlı Dağılım (Pie Chart için SQL Aggregation)
const getCategoryBreakdown = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type = 'expense' } = req.query;

    const breakdown = await Transaction.findAll({
      where: { userId, type },
      attributes: [
        [sequelize.col('Category.name'), 'categoryName'],
        [sequelize.col('Category.color'), 'color'],
        [sequelize.fn('SUM', sequelize.col('amount')), 'totalAmount'],
      ],
      include: [{ model: Category, attributes: [] }],
      group: ['Category.id', 'Category.name', 'Category.color'],
      raw: true,
    });

    res.json(breakdown);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createTransaction, getTransactions, getSummary, getCategoryBreakdown };
