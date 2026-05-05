const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  subject: { type: String, required: true },
  
  // Link nem kötelező. De lehet ha kell, csak írd át a false-t true-ra!
  link: { type: String, required: false },
  
  teacherId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }
}, { timestamps: true });

module.exports = mongoose.model('Material', materialSchema);