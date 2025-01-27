// otpService.js
const db = require('../config/db'); // Import your database connection
const { sendWhatsAppMessage } = require('../utils/whatsappService');

class OTP {
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
      return new Promise((resolve, reject) => {
        db.query(query, values, (err, result) => {
          if (err) {
            reject(new Error(`Failed to upsert OTP: ${err.message}`));
          } else {
            resolve(result);
          }
        });
      });
    } catch (error) {
      throw new Error(`Failed to upsert OTP: ${error.message}`);
    }
  }

  // Find an OTP by phone number
  static async findByPhone(phone) {
    const query = 'SELECT * FROM OTP WHERE phone = ?';
    const values = [phone];

    try {
      return new Promise((resolve, reject) => {
        db.query(query, values, (err, rows) => {
          if (err) {
            reject(err);
          } else {
            console.log('Query Result:', rows);
            resolve(rows[0]); // Return the first matching OTP record or null if not found
          }
        });
      });
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
      return new Promise((resolve, reject) => {
        db.query(query, values, (err, result) => {
          if (err) {
            reject(new Error(`Failed to delete OTP: ${err.message}`));
          } else {
            resolve(result);
          }
        });
      });
    } catch (error) {
      throw new Error(`Failed to delete OTP: ${error.message}`);
    }
  }

  // Delete expired OTPs
  static async deleteExpired() {
    const query = 'DELETE FROM OTP WHERE expiresAt < NOW()';

    try {
      return new Promise((resolve, reject) => {
        db.query(query, (err, result) => {
          if (err) {
            reject(new Error(`Failed to delete expired OTPs: ${err.message}`));
          } else {
            resolve(result);
          }
        });
      });
    } catch (error) {
      throw new Error(`Failed to delete expired OTPs: ${error.message}`);
    }
  }

  // Generate a 4-digit OTP
  static generateOTP() {
    return Math.floor(1000 + Math.random() * 9000);
  }

  // Send an OTP via WhatsApp
  static async sendOTP(phone) {
    const otp = OTP.generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry

    try {
      await OTP.upsert(phone, otp.toString(), expiresAt);
      // Uncomment the line below to send OTP via WhatsApp
       await sendWhatsAppMessage(phone, otp);
      console.log(`OTP sent to ${phone}: ${otp}`);
      return otp;
    } catch (error) {
      throw new Error(`Failed to send OTP: ${error.message}`);
    }
  }

  // Verify an OTP
  static async verifyOTP(phone, otp) {
    try {
      const storedOtp = await OTP.findByPhone(phone);

      if (!storedOtp || storedOtp.otp !== otp) {
        throw new Error('Invalid OTP');
      }

      if (new Date() > storedOtp.expiresAt) {
        throw new Error('OTP has expired');
      }

      // Delete the OTP after successful verification
      await OTP.deleteByPhone(phone);

      return true;
    } catch (error) {
      throw new Error(`Failed to verify OTP: ${error.message}`);
    }
  }
}

module.exports = OTP;
