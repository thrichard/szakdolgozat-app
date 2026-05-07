const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Ez az e-mail már foglalt.' });
    }

    const newUser = new User({
      username,
      email,
      password,
      role: role || 'student'
    });

    await newUser.save();
    res.status(201).json({ message: 'Regisztráció sikeres' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Szerverhiba' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Nincs ilyen user' });

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(400).json({ message: 'Hibás jelszó' });

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
        role: user.role,
        xp: user.xp,
        level: user.level
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Hiba a loginnal' });
  }
});

// profil lekerese a dashboard adatokhoz
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); 
    if (!user) return res.status(404).json({ message: 'User nem talalhato' });
    
    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Szerverhiba' });
  }
});

module.exports = router;