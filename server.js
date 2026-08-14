const express = require('express');
const dotenv = require('dotenv');
const { sequelize, connectDB } = require('./config/db');
require('./models');

const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Finance Tracker API Çalışıyor.' });
});

connectDB().then(() => {
  sequelize.sync({ force: false }).then(() => {
    console.log('PostgreSQL Veritabanı ve Tablolar Hazır.');
    app.listen(PORT, () => {
      console.log(`Sunucu http://localhost:${PORT} üzerinde aktif.`);
    });
  });
});
