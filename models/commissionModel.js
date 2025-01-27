const db = require('../config/db');

class Commission {
  // Create a new commission record
  // static async createCommission(userId, amount, level) {
  //   const query =
  //     'INSERT INTO commissions (user_id, amount, level) VALUES (?, ?, ?)';
  //   return new Promise((resolve, reject) => {
  //     db.query(query, [userId, amount, level], (err, result) => {
  //       if (err) return reject(err);
  //       resolve(result.insertId);
  //     });
  //   });
  // }

  static createCommission(userId, amount, level, earnedFrom) {
    const query =
      'INSERT INTO commissions (user_id, amount, level, earned_from) VALUES (?, ?, ?, ?)';
    return new Promise((resolve, reject) => {
      db.query(query, [userId, amount, level, earnedFrom], (err, result) => {
        if (err) return reject(err);
        resolve(result.insertId);
      });
    });
  }

  // Get all commissions for a user
  static async getCommissionsByUser(userId) {
    const query = 'SELECT * FROM commissions WHERE user_id = ?';
    return new Promise((resolve, reject) => {
      db.query(query, [userId], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }

  // Get total commissions for a user
  static async getTotalCommissions(userId) {
    const query = 'SELECT SUM(amount) AS total FROM commissions WHERE user_id = ?';
    return new Promise((resolve, reject) => {
      db.query(query, [userId], (err, result) => {
        if (err) return reject(err);
        resolve(result[0].total || 0);
      });
    });
  }
}

module.exports = Commission;
