const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const Result = require('../models/Result');
const authMiddleware = require('../middleware/auth');

// 1. Új kvíz létrehozása
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Csak tanárok hozhatnak létre kvízt.' });
    }

    const { title, description, difficulty, questions } = req.body;

    const newQuiz = new Quiz({
      title,
      description,
      difficulty,
      teacherId: req.user.id
    });

    const savedQuiz = await newQuiz.save();

    // Ha vannak kérdések, azokat is elmentjük
    if (questions && questions.length > 0) {
      const questionsToInsert = questions.map(q => ({
        quizId: savedQuiz._id,
        questionText: q.questionText,
        options: q.options,
        correctAnswerIndex: q.correctAnswer !== undefined ? q.correctAnswer : q.correctAnswerIndex
      }));
      await Question.insertMany(questionsToInsert);
    }

    res.status(201).json({ message: 'Kvíz sikeresen létrehozva.', quiz: savedQuiz });
  } catch (err) {
    res.status(500).json({ error: 'Szerverhiba a kvíz létrehozása során.' });
  }
});

// 2. Összes kvíz lekérdezése
router.get('/', authMiddleware, async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate('teacherId', 'username').sort({ createdAt: -1 });
    res.status(200).json(quizzes);
  } catch (err) {
    res.status(500).json({ error: 'Szerverhiba az adatok lekérdezésekor.' });
  }
});

// 3. Egy konkrét kvíz és kérdéseinek lekérdezése
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('teacherId', 'username');
    if (!quiz) return res.status(404).json({ message: 'A kért kvíz nem található.' });

    const questions = await Question.find({ quizId: req.params.id });
    res.status(200).json({ quiz, questions });
  } catch (err) {
    res.status(500).json({ error: 'Szerverhiba a kvíz betöltésekor.' });
  }
});

// 4. KVÍZ MÓDOSÍTÁSA (Verziószám növelésével)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) return res.status(404).json({ message: 'A kvíz nem található.' });
    
    // Csak a kvíz létrehozója módosíthatja
    if (quiz.teacherId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Nincs jogosultságod ezt a kvízt módosítani.' });
    }

    const { title, description, difficulty, questions } = req.body;

    // Kvíz adatainak frissítése és VERZIÓSZÁM NÖVELÉSE
    quiz.title = title || quiz.title;
    quiz.description = description || quiz.description;
    quiz.difficulty = difficulty || quiz.difficulty;
    quiz.version += 1; 

    await quiz.save();

    // Régi kérdések törlése és újak beszúrása
    if (questions && questions.length > 0) {
      await Question.deleteMany({ quizId: quiz._id }); // Régi kérdések kuka
      
      const questionsToInsert = questions.map(q => ({
        quizId: quiz._id,
        questionText: q.questionText,
        options: q.options,
        correctAnswerIndex: q.correctAnswer !== undefined ? q.correctAnswer : q.correctAnswerIndex
      }));
      await Question.insertMany(questionsToInsert); // Új kérdések mentése
    }

    res.json({ message: `Kvíz sikeresen frissítve a(z) ${quiz.version}. verzióra!`, quiz });
  } catch (err) {
    res.status(500).json({ error: 'Szerverhiba a kvíz módosítása során.' });
  }
});

// 5. KVÍZ TÖRLÉSE
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) return res.status(404).json({ message: 'A kvíz nem található.' });
    
    // Csak a saját kvízét törölheti a tanár
    if (quiz.teacherId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Nincs jogosultságod ezt a kvízt törölni.' });
    }

    // Töröljük a kvízt ÉS a hozzá tartozó összes kérdést
    await Quiz.findByIdAndDelete(req.params.id);
    await Question.deleteMany({ quizId: req.params.id });

    res.json({ message: 'Kvíz és a hozzá tartozó kérdések sikeresen törölve.' });
  } catch (err) {
    res.status(500).json({ error: 'Szerverhiba a törlés során.' });
  }
});

// 6. Diák válaszainak beküldése
router.post('/:id/submit', authMiddleware, async (req, res) => {
  try {
    const { answers } = req.body;
    const questions = await Question.find({ quizId: req.params.id });

    let score = 0;
    questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswerIndex) {
        score++;
      }
    });

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
    res.status(500).json({ error: 'Hiba az eredmény kiértékelése során.' });
  }
});

module.exports = router;