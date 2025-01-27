const db = require('../config/db');

 class userDashboard {

    // Find user recent activity
    static getRecentActivity(userId) {
        console.log("userId", userId);
        
        const query = `
      SELECT
        first_name,
        last_name,
        referral_code,
        phone,
        image,
        created_at,
        stage,
        (select stage_name from stage where id = stage) as stageName
        
      FROM users
      WHERE referred_by = ?
      ORDER BY created_at DESC
      LIMIT 5;  
    `;
         
        return new Promise((resolve, reject) => {
          db.query(query, [userId], (err, result) => {
            if (err) return reject(err);
            resolve(result);
          });
        });
      }




// Function to get dashboard data without recent activity
// static dashboard(userId) {
//     const query = `
//     SELECT COUNT(*) AS totalReferrals,
//            SUM(points) AS pointsEarned,
//            COUNT(CASE WHEN active_status = 1 THEN 1 END) AS activeReferrals,
//            (COUNT(CASE WHEN active_status = 1 THEN 1 END) / COUNT(*) * 100) AS referralProgress
//     FROM users
//     WHERE referred_by = ?
//   `;
  
//   console.log("Executing query:", query);  // Log the query
  
//   return new Promise((resolve, reject) => {
//     db.query(query, [userId], (err, result) => {
//       if (err) {
//         console.error("Error executing query:", err);  // Log the error
//         return reject(err);
//       }
//       console.log("Query result:", result);  // Log the result
//       resolve(result[0]);
//     });
//   });
//   }



   
  
  
static dashboard(userId) {
    const query = `
      SELECT 
        COUNT(*) AS totalReferrals,
        SUM(points) AS pointsEarned,
        COUNT(CASE WHEN active_status = 1 THEN 1 END) AS activeReferrals,
        (SELECT stage_name FROM stage WHERE id = (SELECT stage FROM users WHERE id = ?)) AS currentStage,
        (SELECT stage FROM users WHERE id = ?) AS stageId,
        (SELECT COUNT(*) FROM stage) AS stageCount
      FROM users
      WHERE referred_by = ?
    `;
  
    return new Promise((resolve, reject) => {
      db.query(query, [userId, userId, userId], (err, result) => {
        if (err) {
          console.error("Error executing query:", err);  // Log the error
          return reject({ message: "Database query failed", error: err });
        }
        if (result.length === 0) {
          console.log("No referrals found for userId:", userId);  // Log if no referrals are found
          return resolve({
            totalReferrals: 0,
            pointsEarned: 0,
            activeReferrals: 0,
            currentStage: null,
            stageId: null,
            stageCount: 0,
          });
        }
        resolve(result[0]);
      });
    });
  }
  

}
module.exports = userDashboard;