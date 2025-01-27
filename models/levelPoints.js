const db = require('../config/db');

class LevelPoints {
  // Get points for a specific level
  static getPointsByLevel(level) {
    const query = 'SELECT * FROM level_points WHERE level = ? AND active_status = 1';
    return new Promise((resolve, reject) => {
      db.query(query, [level], (err, result) => {
        if (err) return reject(err);
        resolve(result[0]);
      });
    });
  }
}

module.exports = LevelPoints;