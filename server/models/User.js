const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true, // Kötelező megadni
      trim: true,     // Eltávolítja a szóközöket az elejéről és a végéről
      minlength: 3    // Legalább 3 karakter hosszú kell legyen
    },
    email: {
      type: String,
      required: true,
      unique: true,   // Nem regisztrálhat két ember ugyanazzal az emaillel
      trim: true,
      lowercase: true // Mindig kisbetűssé alakítja mentés előtt
    },
    password: {
      type: String,
      required: true,
      minlength: 6    // Biztonsági okokból legalább 6 karakter
    },
    role: {
      type: String,
      enum: ['student', 'teacher'], // CSAK ez a két érték lehet
      default: 'student'            // Ha nem adunk meg semmit, alapból diák lesz
    }
  },
  { 
    timestamps: true // Ez egy varázsszó: automatikusan létrehoz és frissít egy 'createdAt' és 'updatedAt' dátumot minden felhasználónál!
  }
);
const bcrypt = require('bcryptjs');

// Mielőtt elmentjük a felhasználót...
userSchema.pre('save', async function() {
  // Csak akkor titkosítunk, ha a jelszó megváltozott (vagy új)
  if (!this.isModified('password')) return;

  // "Sózás" és Hash-elés
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
module.exports = mongoose.model('User', userSchema);