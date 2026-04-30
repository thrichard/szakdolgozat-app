/**
 * Tananyagkezelő API végpontok (Routes).
 * Felelős a tananyagok (dokumentumok, linkek) létrehozásáért, lekérdezéséért,
 * módosításáért és törléséért (CRUD műveletek).
 */

const express = require('express');
const router = express.Router();
const Material = require('../models/Material'); 
const authMiddleware = require('../middleware/auth'); 

/**
 * @route   POST /api/materials
 * @desc    Új oktatási anyag feltöltése az adatbázisba.
 * @access  Privát (Csak 'teacher' jogosultsággal)
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    // Jogosultság ellenőrzése
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: "A művelet végrehajtásához oktatói jogosultság szükséges." });
    }

    const { title, description, subject, link } = req.body;

    const newMaterial = new Material({
      title,
      description,
      subject,
      link,
      teacherId: req.user.id 
    });

    const savedMaterial = await newMaterial.save();
    res.status(201).json({ message: "Tananyag sikeresen regisztrálva.", material: savedMaterial });
  } catch (err) {
    res.status(500).json({ error: "Szerverhiba a feltöltés során.", details: err.message });
  }
});

/**
 * @route   GET /api/materials
 * @desc    Elérhető tananyagok listázása csökkenő időrendben.
 * @access  Privát (Hitelesített felhasználók)
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const materials = await Material.find()
      .populate('teacherId', 'username email')
      .sort({ createdAt: -1 });
    res.status(200).json(materials);
  } catch (err) {
    res.status(500).json({ error: "Szerverhiba az adatok lekérdezésekor." });
  }
});

/**
 * @route   PUT /api/materials/:id
 * @desc    Meglévő tananyag metaadatainak módosítása.
 * @access  Privát (Csak a tananyagot létrehozó oktató számára)
 */
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    let material = await Material.findById(req.params.id);
    if (!material) return res.status(404).json({ message: "A kért tananyag nem található." });

    // Objektumszintű jogosultság ellenőrzés
    if (material.teacherId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Nincs jogosultságod a rekord szerkesztéséhez." });
    }

    material = await Material.findByIdAndUpdate(
      req.params.id, 
      { $set: req.body }, 
      { new: true } // Visszatérés a frissített dokumentummal
    );

    res.json({ message: "Tananyag sikeresen frissítve.", material });
  } catch (err) {
    res.status(500).json({ error: "Szerverhiba a módosítás során." });
  }
});

/**
 * @route   DELETE /api/materials/:id
 * @desc    Tananyag eltávolítása a rendszerből.
 * @access  Privát (Csak a tananyagot létrehozó oktató számára)
 */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) return res.status(404).json({ message: "A kért tananyag nem található." });

    if (material.teacherId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Nincs jogosultságod a rekord törléséhez." });
    }

    await Material.findByIdAndDelete(req.params.id);
    res.json({ message: "Tananyag sikeresen eltávolítva." });
  } catch (err) {
    res.status(500).json({ error: "Szerverhiba a törlés során." });
  }
});

module.exports = router;