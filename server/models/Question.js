const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  quizId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Quiz', 
    required: true 
  },
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }], // Válaszlehetőségek tömbje
  correctAnswerIndex: { type: Number, required: true } // Melyik a jó válasz (0, 1, 2...)
});

module.exports = mongoose.model('Question', questionSchema);