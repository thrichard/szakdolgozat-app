/**
 * Vizsgaeredmények kezeléséért felelős API végpontok (Routes).
 * Biztosítja a diákok számára a saját eredményeik lekérdezését,
 * az oktatók számára pedig a globális osztálynapló (összes eredmény) elérését.
 */

const express = require('express');
const router = express.Router();
const Result = require('../models/Result');
const authMiddleware = require('../middleware/auth');

/**
 * @route   GET /api/results/all
 * @desc    A rendszerben rögzített összes vizsgaeredmény lekérdezése (Osztálynapló nézet).
 * @access  Privát (Csak 'teacher' jogosultsággal)
 */
router.get('/all', authMiddleware, async (req, res) => {
  try {
    // Szerepkör alapú hozzáférés-szabályozás (RBAC)
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: "A művelet végrehajtásához oktatói jogosultság szükséges." });
    }

    // Eredmények aggregációja a kapcsolódó diák és kvíz entitásokkal
    const results = await Result.find()
      .populate('studentId', 'username email')
      .populate('quizId', 'title')
      .sort({ createdAt: -1 }); 

    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: "Szerverhiba az adatok lekérdezésekor." });
  }
});

/**
 * @route   GET /api/results
 * @desc    A hitelesített felhasználó (diák) saját vizsgaeredményeinek lekérdezése.
 * @access  Privát (Hitelesített felhasználók)
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    // Eredmények szűrése a JWT tokenből kinyert felhasználói azonosító alapján
    const results = await Result.find({ studentId: req.user.id })
      .populate('quizId', 'title')
      .sort({ createdAt: -1 });
      
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: "Szerverhiba az adatok lekérdezésekor." });
  }
});

module.exports = router;