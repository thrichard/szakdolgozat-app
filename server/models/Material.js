const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  subject: { type: String, required: true },
  
  // Link a Google Drive fájlhoz, YouTube videóhoz, stb.
  link: { type: String, required: false },
  
  // Opcionális kódrészlet a diákoknak
  codeSnippet: { type: String, default: "" },
  
  // Milyen nyelven íródott a kód? (Alapértelmezetten C)
  language: { type: String, default: "c" },

  // 14 hetes szemeszter logikához
  weekNumber: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 14 
  },
  
  teacherId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }
}, { timestamps: true });

module.exports = mongoose.model('Material', materialSchema);