/**
 * Autentikációs és azonosítási végpontok (Routes).
 * Felelős a felhasználók regisztrációjáért, a jelszavak biztonságos tárolásáért (BCrypt),
 * valamint a bejelentkezési folyamat során a JWT (JSON Web Token) generálásáért.
 */

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Új felhasználó regisztrációja a rendszerbe.
 * @access  Publikus
 */
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Ellenőrizzük, hogy az e-mail cím szerepel-e már az adatbázisban
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Ezzel az e-mail címmel már regisztráltak." });
    }

    // Jelszó titkosítása (hashing) Bcrypt algoritmussal
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Új felhasználói entitás létrehozása és mentése
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role || 'student' // Alapértelmezett jogosultsági szint: diák
    });

    await newUser.save();
    res.status(201).json({ message: "Sikeres regisztráció." });
  } catch (err) {
    res.status(500).json({ error: "Szerverhiba a regisztráció során." });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Felhasználó bejelentkeztetése és hozzáférési token (JWT) kiadása.
 * @access  Publikus
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Felhasználó azonosítása e-mail cím alapján
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "A megadott felhasználó nem található." });
    }

    // A megadott jelszó és a titkosított hash összehasonlítása
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Érvénytelen bejelentkezési adatok." });
    }

    // JWT token generálása a jogosultság-kezeléshez (Payload: id, role)
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' } // A token érvényességi ideje: 1 nap
    );

    res.json({
      token,
      user: { id: user._id, username: user.username, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error("🔥 BEJELENTKEZÉSI HIBA:", err);
    res.status(500).json({ error: "Szerverhiba a bejelentkezés során." });
  }
});

module.exports = router;