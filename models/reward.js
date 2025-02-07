const db = require('../config/db');

class Reward {
  static async getAllRewards() {
    const [rows] = await db.query('SELECT * FROM rewards');
    return rows;
  }

  static async getRewardById(id) {
    const [rows] = await db.query('SELECT * FROM rewards WHERE id = ?', [id]);
    return rows[0];
  }

  static async createReward(name, points_required, min_ref, description, image_url, is_active) {
    const [result] = await db.query(
      'INSERT INTO rewards (name, points_required, min_ref, description, image_url, is_active) VALUES (?, ?, ?, ?, ?, ?)',
      [name, points_required, min_ref, description, image_url, is_active] 
    );
    return result.insertId;
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
