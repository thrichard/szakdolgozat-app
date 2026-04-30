const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  const authHeader = req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Hozzáférés megtagadva. Hiányzó vagy hibás token.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Itt adjuk át a felhasználó ID-ját és szerepkörét a végpontoknak
    next();
  } catch (error) {
    res.status(401).json({ message: 'Érvénytelen vagy lejárt token.' });
  }
};