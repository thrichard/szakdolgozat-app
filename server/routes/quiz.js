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
    const quizzes = await Quiz.find().populate('teacherId', 'username').sort({weekNumber: 1, createdAt: -1 });
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

// 5. Kvíz törlése (XP és Szint visszavonásával)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'A kvíz nem található.' });

    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Nincs jogosultságod ezt a kvízt törölni.' });
    }

    // 1. Kikeresük az összes eredményt, ami ehhez a kvízhez tartozik
    const results = await Result.find({ quizId: req.params.id });

    // 2. Kigyűjtjük diákonként a MAX pontszámot (mivel a legjobb kitöltésért járt az XP)
    const maxScoresByUser = {};
    results.forEach(result => {
      const sId = result.studentId.toString();
      if (!maxScoresByUser[sId] || result.percentage > maxScoresByUser[sId]) {
        maxScoresByUser[sId] = result.percentage;
      }
    });

    // 3. Minden érintett diáktól levonjuk az XP-t, és beállítjuk az új szintet
    for (const studentId in maxScoresByUser) {
      const student = await User.findById(studentId);
      if (student) {
        const xpToDeduct = maxScoresByUser[studentId];
        
        // XP csökkentése (biztosítjuk, hogy ne menjen mínuszba)
        student.xp = Math.max(0, student.xp - xpToDeduct); 
        
        // Szint VISSZASZÁMOLÁSA az RPG matek alapján
        let newLevel = 1;
        let tempXp = student.xp;
        let needed = 100;
        
        while (tempXp >= needed) {
          tempXp -= needed;
          newLevel++;
          needed = newLevel * 100;
        }
        student.level = newLevel; 
        
        await student.save();
      }
    }

    // 4. Biztonságosan törölhetünk mindent a kukába
    await Quiz.findByIdAndDelete(req.params.id);
    await Question.deleteMany({ quizId: req.params.id });
    await Result.deleteMany({ quizId: req.params.id });

    res.json({ message: 'Kvíz törölve, diákok XP-je és szintje korrigálva.' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Szerverhiba a törlés során.' });
  }
});

// 6. diak valaszainak bekuldese
router.post('/:id/submit', authMiddleware, async (req, res) => {
  try {
    const { answers } = req.body;
    const questions = await Question.find({ quizId: req.params.id });

    let score = 0;
    questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswerIndex) score++;
    });

    const percent = Math.round((score / questions.length) * 100);

    // Megkeressük az eddigi legjobb eredményét
    const previousResults = await Result.find({
      studentId: req.user.id,
      quizId: req.params.id
    });

    let maxPreviousPercent = 0;
    if (previousResults.length > 0) {
      maxPreviousPercent = Math.max(...previousResults.map(r => r.percentage));
    }

    // Csak a KÜLÖNBSÉGET kapja meg XP-ben, ha jobbat írt, mint a rekordja
    let gainedXp = 0;
    if (percent > maxPreviousPercent) {
      gainedXp = percent - maxPreviousPercent;
    }

    // 1. Eredmeny mentese
    const result = new Result({
      studentId: req.user.id,
      quizId: req.params.id,
      score,
      totalQuestions: questions.length,
      percentage: percent
    });
    await result.save();

    // 2. XP es szintlepes
    const student = await User.findById(req.user.id);
    let leveledUp = false;

    if (gainedXp > 0 && student) {
      student.xp += gainedXp;

      // RPG szintlépés logika
      let newLevel = 1;
      let tempXp = student.xp;
      let needed = 100;
      
      while (tempXp >= needed) {
        tempXp -= needed;
        newLevel++;
        needed = newLevel * 100;
      }

      if (newLevel > student.level) {
        student.level = newLevel;
        leveledUp = true;
      }
      
      await student.save();
    }

    res.json({
      result,
      gainedXp,
      totalXp: student?.xp || 0,
      currentLevel: student?.level || 1,
      leveledUp,
      isRetake: previousResults.length > 0, // Igaz, ha már próbálta korábban
      improved: gainedXp > 0                // Igaz, ha most új rekordot döntött
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Hiba a kiértékelésnél' });
  }
});

module.exports = router;