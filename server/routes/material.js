const express = require('express');
const router = express.Router();
const Material = require('../models/Material'); 
const authMiddleware = require('../middleware/auth'); 

// Új tananyag feltöltése
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'A művelet végrehajtásához tanári jogosultság szükséges.' });
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
    res.status(201).json({ message: 'Tananyag sikeresen feltöltve.', material: savedMaterial });
  } catch (error) {
    res.status(500).json({ error: 'Szerverhiba a feltöltés során.' });
  }
});

// Összes tananyag lekérdezése
router.get('/', authMiddleware, async (req, res) => {
  try {
    const materials = await Material.find()
      .populate('teacherId', 'username email')
      .sort({ createdAt: -1 });
    
    res.status(200).json(materials);
  } catch (error) {
    res.status(500).json({ error: 'Szerverhiba az adatok lekérdezésekor.' });
  }
});

// EGY ADOTT TANANYAG LEKÉRDEZÉSE (Ez hiányzott a szerkesztés betöltéséhez!)
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ message: 'A tananyag nem található.' });
    }
    res.status(200).json(material);
  } catch (error) {
    res.status(500).json({ error: 'Szerverhiba a tananyag lekérdezésekor.' });
  }
});

// Tananyag módosítása
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    let material = await Material.findById(req.params.id);
    if (!material) return res.status(404).json({ message: 'A tananyag nem található.' });

    // Csak a saját anyagát szerkesztheti a tanár
    if (material.teacherId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Nincs jogosultságod ezt a tananyagot szerkeszteni.' });
    }

    material = await Material.findByIdAndUpdate(
      req.params.id, 
      { $set: req.body }, 
      { new: true } 
    );

    res.json({ message: 'Tananyag sikeresen frissítve.', material });
  } catch (error) {
    res.status(500).json({ error: 'Szerverhiba a módosítás során.' });
  }
});

// Tananyag törlése
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) return res.status(404).json({ message: 'A tananyag nem található.' });

    // Csak a saját anyagát törölheti a tanár
    if (material.teacherId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Nincs jogosultságod ezt a tananyagot törölni.' });
    }

    await Material.findByIdAndDelete(req.params.id);
    res.json({ message: 'Tananyag sikeresen törölve.' });
  } catch (error) {
    res.status(500).json({ error: 'Szerverhiba a törlés során.' });
  }
});

module.exports = router;