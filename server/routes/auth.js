const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// --- REGISZTRÁCIÓ ---
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Ezzel az e-mail címmel már regisztráltak.' });
    }

    // A jelszó hashelését a User modell pre('save') hookja automatikusan elvégzi
    const newUser = new User({
      username,
      email,
      password,
      role: role || 'student'
    });

    await newUser.save();
    
    res.status(201).json({ message: 'Sikeres regisztráció.' });
  } catch (error) {
    console.error('Regisztrációs hiba:', error);
    res.status(500).json({ error: 'Szerverhiba a regisztráció során.' });
  }
});

// --- BEJELENTKEZÉS ---
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'A megadott felhasználó nem található.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Érvénytelen bejelentkezési adatok.' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: { 
        id: user._id, 
        username: user.username, 
        email: user.email, 
        role: user.role 
      }
    });
  } catch (error) {
    console.error('Bejelentkezési hiba:', error);
    res.status(500).json({ error: 'Szerverhiba a bejelentkezés során.' });
  }
});

module.exports = router;