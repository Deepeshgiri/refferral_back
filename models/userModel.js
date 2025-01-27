const db = require('../config/db');
const Referral = require('./referralModel');

class User {
  // Create a new user
  static createUser(firstName, lastName, phone, referralCode, referredBy) {
    const query =
      'INSERT INTO users (first_name, last_name, phone, referral_code, referred_by) VALUES (?, ?, ?, ?, ?)';
    return new Promise((resolve, reject) => {
      db.query(
        query,
        [firstName, lastName, phone, referralCode, referredBy],
        (err, result) => {
          if (err) return reject(err);
          resolve(result.insertId);

          // if(referredBy){
          //   Referral.createReferral(referredBy, result.insertId,1);
          // }
        }
      );
    });

  }

  // Find user by phone number
  static findByPhone(phone) {
    const query = 'SELECT * FROM users WHERE phone = ?';
    return new Promise((resolve, reject) => {
      db.query(query, [phone], (err, result) => {
        if (err) return reject(err);
        resolve(result[0]);
      });
    });
  }

  // Find user by referral code
  static findByReferralCode(referralCode) {
    const query = 'SELECT * FROM users WHERE referral_code = ?';
    return new Promise((resolve, reject) => {
      db.query(query, [referralCode], (err, result) => {
        if (err) return reject(err);
        resolve(result[0]);
      });
    });
  }


  static getAllStage(){
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM stage', (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }

  
  // Update user stage
  static updateStage(userId, stage) {
    const query = 'UPDATE users SET stage = ? WHERE id = ?';
    return new Promise((resolve, reject) => {
      db.query(query, [stage, userId], (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }

  // Add points to user
  static addPoints(userId, points) {
    const query = 'UPDATE users SET points = points + ? WHERE id = ?';
    return new Promise((resolve, reject) => {
      db.query(query, [points, userId], (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }

  // Get user details by ID
  static findById(userId) {
    const query = 'SELECT * FROM users WHERE id = ?';
    return new Promise((resolve, reject) => {
      db.query(query, [userId], (err, result) => {
        if (err) return reject(err);
        resolve(result[0]);
      });
    });
  }



  

}
module.exports = User;