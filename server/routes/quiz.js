const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const Result = require('../models/Result');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

// 1. Új kvíz létrehozása
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Csak tanárok hozhatnak létre kvízt.' });
    }
    const { title, description, difficulty, questions } = req.body;
    const newQuiz = new Quiz({ title, description, difficulty, teacherId: req.user.id });
    const savedQuiz = await newQuiz.save();
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

// 3. Egy konkrét kvíz lekérdezése
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

// 4. Kvíz módosítása
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'A kvíz nem található.' });
    if (quiz.teacherId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Nincs jogosultságod ezt a kvízt módosítani.' });
    }
    const { title, description, difficulty, questions } = req.body;
    quiz.title = title || quiz.title;
    quiz.description = description || quiz.description;
    quiz.difficulty = difficulty || quiz.difficulty;
    quiz.version += 1; 
    await quiz.save();
    if (questions && questions.length > 0) {
      await Question.deleteMany({ quizId: quiz._id });
      const questionsToInsert = questions.map(q => ({
        quizId: quiz._id,
        questionText: q.questionText,
        options: q.options,
        correctAnswerIndex: q.correctAnswer !== undefined ? q.correctAnswer : q.correctAnswerIndex
      }));
      await Question.insertMany(questionsToInsert);
    }
    res.json({ message: `Kvíz sikeresen frissítve a(z) ${quiz.version}. verzióra!`, quiz });
  } catch (err) {
    res.status(500).json({ error: 'Szerverhiba a kvíz módosítása során.' });
  }
});

// 5. Kvíz törlése
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'A kvíz nem található.' });
    if (quiz.teacherId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Nincs jogosultságod ezt a kvízt törölni.' });
    }
    await Quiz.findByIdAndDelete(req.params.id);
    await Question.deleteMany({ quizId: req.params.id });
    res.json({ message: 'Kvíz és a hozzá tartozó kérdések sikeresen törölve.' });
  } catch (err) {
    res.status(500).json({ error: 'Szerverhiba a törlés során.' });
  }
});

// 6. DIÁK VÁLASZAINAK BEKÜLDÉSE + XP SZÁMÍTÁS
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
    
    // 1. Eredmény mentése
    const newResult = new Result({
      studentId: req.user.id,
      quizId: req.params.id,
      score,
      totalQuestions: questions.length,
      percentage
    });
    await newResult.save();

    // 2. SZINTLÉPÉS LOGIKA
    const student = await User.findById(req.user.id);
    let leveledUp = false;
    let gainedXp = percentage; // Alapképlet: 1% = 1 XP

    if (student) {
      student.xp += gainedXp;

      // Szintlépés ellenőrzése: amíg az XP eléri a küszöböt (Level * 100), szintet lép
      // 1. szintről 2-re 100 XP kell. 2-ről 3-ra 200 XP kell.
      while (student.xp >= student.level * 100) {
        student.level += 1;
        leveledUp = true;
      }
      
      await student.save();
    }

    // 3. Válasz küldése a frontendnek az új adatokkal
    res.status(200).json({
      result: newResult,
      gainedXp,
      totalXp: student ? student.xp : 0,
      currentLevel: student ? student.level : 1,
      leveledUp
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Hiba az eredmény kiértékelése során.' });
  }
});

module.exports = router;