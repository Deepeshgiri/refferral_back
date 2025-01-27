// models/OTP.js
const db = require('../config/db'); // Import your database connection

class OTP {
    // Create or update an OTP
    // Create or update an OTP
    static async upsert(phone, otp, expiresAt) {
        const query = `
      INSERT INTO OTP (phone, otp, expiresAt)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE
        otp = VALUES(otp),
        expiresAt = VALUES(expiresAt)
    `;
        const values = [phone, otp, expiresAt];

        try {
            const result = await db.execute(query, values); // Execute the query
            return result; // Return the result
        } catch (error) {
            throw new Error(`Failed to upsert OTP: ${error.message}`);
        }
    }

    // Find an OTP by phone number
static async findByPhone(phone) {
    const query = 'SELECT * FROM OTP WHERE phone = ?'; // Use parameterized query
    const values = [phone];

    try {
        // Execute the query with parameterized values
        const [rows] = await db.execute(query, values);

        // Debugging: Log the query result
        console.log('Query result:', rows);

        // Check if any rows were returned
        if (rows.length > 0) {
            return rows[0]; // Return the first matching OTP record
        } else {
            return null; // Return null if no matching OTP was found
        }
    } catch (error) {
        console.error('Error in findByPhone:', error); // Log the error for debugging
        throw new Error(`Failed to find OTP: ${error.message}`);
    }
}


    // Delete an OTP by phone number
    static async deleteByPhone(phone) {
        const query = 'DELETE FROM OTP WHERE phone = ?';
        const values = [phone];

        try {
            const [result] = await db.execute(query, values);
            return result;
        } catch (error) {
            throw new Error(`Failed to delete OTP: ${error.message}`);
        }
    }

    // Delete expired OTPs
    static async deleteExpired() {
        const query = 'DELETE FROM OTP WHERE expiresAt < NOW()';

        try {
            const [result] = await db.execute(query);
            return result;
        } catch (error) {
            throw new Error(`Failed to delete expired OTPs: ${error.message}`);
        }
    }
}

module.exports = OTP;