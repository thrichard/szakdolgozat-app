const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  subject: { type: String, required: true },
  link: { type: String, required: false },
  codeSnippet: { type: String, default: "" },
  
  // ÚJ MEZŐ: Milyen nyelven íródott a kód? (Alapértelmezetten C)
  language: { type: String, default: "c" },
  
  teacherId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }
}, { timestamps: true });

module.exports = mongoose.model('Material', materialSchema);