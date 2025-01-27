const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

// Authenticate user
const authenticateUser = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
   // console.log("decoded", decoded);
    req.user = { userId: decoded.id };
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};

// Authenticate admin
const authenticateAdmin = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });
console.log(req.header('Authorization'))
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("decoded", decoded);
    req.admin = { adminId: decoded.id };
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};

module.exports = { authenticateUser, authenticateAdmin };