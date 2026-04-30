/**
 * JWT (JSON Web Token) hitelesítési köztesréteg (Middleware).
 * Feladata a bejövő HTTP kérések Authorization fejlécének vizsgálata,
 * a token dekódolása, és a hitelesített felhasználói adatok (payload)
 * továbbítása a kérés (req) objektumban.
 */

const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // Token kinyerése a HTTP fejlécből (szabványos Bearer formátum)
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ message: "Hozzáférés megtagadva. Hiányzó hitelesítési token." });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: "Érvénytelen token formátum." });
  }

  try {
    // Token validálása és dekódolása a titkosított kulcs (JWT_SECRET) segítségével
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // A dekódolt felhasználói adatok hozzáfűzése a kérés objektumhoz
    req.user = decoded;
    
    // Vezérlés átadása a következő middleware-nek vagy a végpont kezelőjének
    next();
  } catch (err) {
    res.status(401).json({ message: "Érvénytelen vagy lejárt token." });
  }
};