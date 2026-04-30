const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  teacherId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  materialId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Material' // Opcionális: a kvíz tartozhat egy konkrét tananyaghoz
  },
  difficulty: { 
    type: String, 
    enum: ['easy', 'medium', 'hard'], 
    default: 'medium' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);