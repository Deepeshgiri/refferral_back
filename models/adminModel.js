const db = require('../config/db');

class Admin {
  // Find admin by username
  static async findByUsername(username) {
    const query = 'SELECT * FROM admins WHERE username = ?';
    try {
      const [result] = await db.promise().query(query, [username]);
      
      return result[0]; // Return the first result (if exists)
    } catch (err) {
      throw err;
    }
  }

// Update user details (admin only)
static async updateUser(userId, name, phone, stage) {
  const query = 'UPDATE users SET first_name = ?, phone = ?, stage = ? WHERE id = ?';
  try {
    const [result] = await db.promise().query(query, [name, phone, stage, userId]);
    
    // If no rows were affected, meaning the user doesn't exist or something went wrong
    if (result.affectedRows === 0) {
      return { success: false, message: 'User not found or no changes were made' };
    }

    return { success: true, message: 'User updated successfully' };
  } catch (err) {
    console.error('Error updating user:', err);
    return { success: false, message: 'Failed to update user due to server error' };
  }
}


  // Get all users (admin only)
  static async getAllUsers() {
    const query = `
SELECT 
  u.id, 
  u.first_name, 
  u.last_name, 
  u.phone, 
  u.stage, 
  u.referred_by, 
  u.referral_code, 
  u.points, 
  u.active_status, 
  u.created_at, 
  COUNT(r.referred_by) AS referral_count,
  ref.first_name AS refree 
FROM users u
LEFT JOIN users r ON u.id = r.referred_by 
LEFT JOIN users ref ON u.referred_by = ref.id 
GROUP BY 
  u.id, 
  u.first_name, 
  u.last_name, 
  u.phone, 
  u.stage, 
  u.referred_by, 
  u.referral_code, 
  u.points, 
  u.active_status, 
  u.created_at;


  `;
    try {
      const [result] = await db.promise().query(query);
      return result;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Admin;
