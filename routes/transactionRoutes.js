const express = require('express');
const router = express.Router();
const {
  createTransaction,
  getTransactions,
  getSummary,
  getCategoryBreakdown,
} = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', createTransaction);
router.get('/', getTransactions);
router.get('/summary', getSummary);
router.get('/category-breakdown', getCategoryBreakdown);

module.exports = router;
