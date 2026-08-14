const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Category } = require('../models');

// Varsayılan kategoriler (Yeni kullanıcı oluşturulduğunda otomatik eklenir)
const defaultCategories = [
  { name: 'Maaş', type: 'income', color: '#10B981', icon: 'DollarSign' },
  { name: 'Market & Gıda', type: 'expense', color: '#EF4444', icon: 'ShoppingCart' },
  { name: 'Faturalar & Kira', type: 'expense', color: '#F59E0B', icon: 'Home' },
  { name: 'Eğlence & Sosyal', type: 'expense', color: '#8B5CF6', icon: 'Film' },
  { name: 'Ulaşım', type: 'expense', color: '#3B82F6', icon: 'Car' },
];

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ where: { email } });
    if (userExists) return res.status(400).json({ message: 'Bu e-posta zaten kayıtlı.' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hashedPassword });

    // Kullanıcıya varsayılan kategorileri atayalım
    const userCategories = defaultCategories.map(cat => ({ ...cat, userId: user.id }));
    await Category.bulkCreate(userCategories);

    res.status(201).json({
      user: { id: user.id, name: user.name, email: user.email },
      token: generateToken(user.id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Geçersiz e-posta veya şifre.' });
    }

    res.json({
      user: { id: user.id, name: user.name, email: user.email },
      token: generateToken(user.id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login };
