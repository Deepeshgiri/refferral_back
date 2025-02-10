const db = require('../config/db');

class Reward {
  static getAllRewards() {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM rewards', (err, res) => {
        if (err) {
          console.log(err);
          reject(err); // Properly reject in case of an error
        } else {
          resolve(res); // Resolve the results
        }
      });
    });
  }
  

  static getRewardById(id) {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM rewards WHERE id = ?', [id], (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res || null); // Return first result or null if no record found
        }
      });
    });
  }
  

  static  createReward(name, points_required, min_ref, description, image_url, is_active) {
    console.log("truuuuuuuuu", is_active)
    const query = 'INSERT INTO rewards (name, points_required, min_ref, description, image_url, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())';
    db.query(query, [name, points_required, min_ref, description, image_url, is_active?1:0],(err,res)=>{
      if(err){
        console.log(err);
      }else{
        
        return res;
      }
    });


  }

  static async updateReward(id, name, points_required, min_ref, description, image_url, is_active) {
    await db.query(
      'UPDATE rewards SET name = ?, points_required = ?, min_ref = ?, description = ?, image_url = ?, is_active = ?, updated_at = NOW() WHERE id = ?',
      [name, points_required, min_ref, description, image_url, is_active, id]
    );
  }

  static async deleteReward(id) {
    await db.query('DELETE FROM rewards WHERE id = ?', [id]);
  }
}

module.exports = Reward;
