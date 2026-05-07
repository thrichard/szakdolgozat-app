const express = require('express');
const router = express.Router();
const Result = require('../models/Result');
const auth = require('../middleware/auth');

// osszes eredmeny lekerese (tanari osztalynaplo)
router.get('/all', auth, async (req, res) => {
  try {
    // csak tanarok nezhetik meg mindenkiet
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Nincs jogosultságod ehhez.' });
    }

    // eredmenyek betoltese + a hozza tartozo diak es kviz adatai
    const results = await Result.find()
      .populate('studentId', 'username email')
      .populate('quizId', 'title')
      .sort({ createdAt: -1 }); 

    // Kiszűrjük azokat a kvízeket amiket töröltek)
    const validResults = results.filter(r => r.quizId != null);

    res.json(validResults);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Szerverhiba az adatok lekérdezésekor.' });
  }
});

// bejelentkezett diak sajat eredmenyei
router.get('/', auth, async (req, res) => {
  try {
    // tokenbol szedjuk az id-t
    const results = await Result.find({ studentId: req.user.id })
      .populate('quizId', 'title')
      .sort({ createdAt: -1 });
      
    // Kiszűrjük a "szellem" eredményeket a diáknál is
    const validResults = results.filter(r => r.quizId != null);

    res.json(validResults);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Szerverhiba.' });
  }
});

module.exports = router;