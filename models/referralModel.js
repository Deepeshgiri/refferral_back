const db = require('../config/db');



class Referral {
  // Create a new referral relationship
  static async createReferral(referrerId, referredId,) {
    const query = 'INSERT INTO referrals (referrer_id, referred_id, level) VALUES (?, ?, ?)';
    return new Promise((resolve, reject) => {
      db.query(query, [referrerId, referredId, 1], (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result.insertId);
      });
    });
  }

  // Get all referrals for a user
  static async getReferralsByUser(userId) {
    const query = 'SELECT * FROM referrals WHERE referrer_id = ?';
    return new Promise((resolve, reject) => {
      db.query(query, [userId], (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  }
static async getallReferredUsers(userId){
  const query = `select * from users where referred_by =?`;
  return new Promise((resolve,reject)=>{
    db.query(query,[userId],(err,result)=>{
      if(err){
        return reject(err);
      }
      resolve(result);
    })
  })
}
  // Get downline users for a user
  static async getDownline(userId, level) {
    const query = 'SELECT * FROM referrals WHERE referrer_id = ? AND level = ?';
    return new Promise((resolve, reject) => {
      db.query(query, [userId, level], (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  }


  static getUpline(userId) {
    const query = `
      WITH RECURSIVE Upline AS (
        SELECT referrer_id AS userId, level
        FROM referrals
        WHERE referred_id = ?

        UNION ALL

        SELECT r.referrer_id, r.level
        FROM referrals r
        INNER JOIN Upline u ON r.referred_id = u.userId
      )
      SELECT * FROM Upline;
    `;
    return new Promise((resolve, reject) => {
      db.query(query, [userId], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }

  
}


module.exports = Referral;
