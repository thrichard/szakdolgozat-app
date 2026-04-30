/**
 * Kvízekkel kapcsolatos API végpontok (Routes).
 * Felelős a kvízek és a hozzájuk tartozó kérdések CRUD műveleteinek kezeléséért,
 * valamint a diákok által beküldött válaszok kiértékeléséért.
 */

const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const authMiddleware = require('../middleware/auth');
const Result = require('../models/Result');

/**
 * @route   POST /api/quizzes
 * @desc    Új kvíz és a hozzá tartozó kérdések létrehozása.
 * @access  Privát (Csak 'teacher' jogosultsággal)
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    // Szerepkör alapú hozzáférés-ellenőrzés (RBAC)
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: "A művelet végrehajtásához oktatói jogosultság szükséges." });
    }

    const { title, description, difficulty, questions } = req.body;

    // Kvíz metaadatainak mentése
    const newQuiz = new Quiz({
      title,
      description,
      difficulty,
      teacherId: req.user.id
    });

    const savedQuiz = await newQuiz.save();

    // Kapcsolódó kérdések tömeges mentése (Bulk insert)
    if (questions && questions.length > 0) {
      const questionsToInsert = questions.map(q => ({
        quizId: savedQuiz._id,
        questionText: q.questionText,
        options: q.options,
        correctAnswerIndex: q.correctAnswer !== undefined ? q.correctAnswer : q.correctAnswerIndex
      }));
      await Question.insertMany(questionsToInsert);
    }

    res.status(201).json({ message: "Kvíz sikeresen regisztrálva.", quiz: savedQuiz });
  } catch (err) {
    res.status(500).json({ error: "Szerverhiba a kvíz létrehozása során.", details: err.message });
  }
});

/**
 * @route   GET /api/quizzes
 * @desc    Az összes elérhető kvíz listázása, a szerző adatainak beágyazásával.
 * @access  Privát (Hitelesített felhasználók)
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate('teacherId', 'username');
    res.status(200).json(quizzes);
  } catch (err) {
    res.status(500).json({ error: "Szerverhiba az adatok lekérdezésekor." });
  }
});

/**
 * @route   GET /api/quizzes/:id
 * @desc    Egy specifikus kvíz és a hozzá tartozó kérdések lekérdezése azonosító alapján.
 * @access  Privát (Hitelesített felhasználók)
 */
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('teacherId', 'username');
    if (!quiz) return res.status(404).json({ message: "A kért kvíz nem található." });

    const questions = await Question.find({ quizId: req.params.id });
    res.status(200).json({ quiz, questions });
  } catch (err) {
    res.status(500).json({ error: "Szerverhiba a kvíz betöltésekor." });
  }
});

/**
 * @route   POST /api/quizzes/:id/submit
 * @desc    Diák válaszainak feldolgozása, automatikus kiértékelés és eredmény mentése.
 * @access  Privát (Hitelesített felhasználók)
 */
router.post('/:id/submit', authMiddleware, async (req, res) => {
  try {
    const { answers } = req.body;
    const questions = await Question.find({ quizId: req.params.id });

    // Válaszok összevetése a helyes indexekkel
    let score = 0;
    questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswerIndex) {
        score++;
      }
    });

    // Százalékos arány számítása és entitás mentése
    const percentage = Math.round((score / questions.length) * 100);
    const newResult = new Result({
      studentId: req.user.id,
      quizId: req.params.id,
      score,
      totalQuestions: questions.length,
      percentage
    });

    await newResult.save();
    res.status(200).json(newResult);
  } catch (err) {
    res.status(500).json({ error: "Hiba az eredmény kiértékelése során." });
  }
});

module.exports = router;