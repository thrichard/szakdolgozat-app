/**
 * Fő szerver belépési pont (Entry Point).
 * Inicializálja az Express alkalmazást, konfigurálja a globális köztesrétegeket (middleware),
 * létrehozza az adatbázis-kapcsolatot, és definiálja az API végpontok útvonalait (routing).
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Útválasztók (Routes) importálása
const authRoutes = require('./routes/auth');
const materialRoutes = require('./routes/material');
const quizRoutes = require('./routes/quiz');
const resultRoutes = require('./routes/result'); 

const app = express();

// Globális middleware-ek konfigurálása
// CORS engedélyezése a kliensoldali (React) kérésekhez
app.use(cors()); 
// Bejövő HTTP kérések törzsének (body) JSON formátumú értelmezése
app.use(express.json()); 

// API végpontok regisztrálása
app.use('/api/auth', authRoutes); 
app.use('/api/materials', materialRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/results', resultRoutes); 

// Adatbázis-kapcsolat felépítése
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Adatbázis kapcsolat sikeresen felépítve."))
  .catch((err) => console.error("Adatbázis csatlakozási hiba:", err));

// Szolgáltatás elérhetőségét vizsgáló (Health check) végpont
app.get('/api/test', (req, res) => {
    res.status(200).json({ status: "ok", message: "A szerver üzemkész." });
});

// Szerver indítása a megadott porton
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Szerver elindítva a ${PORT}-es porton.`);
});