const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { sendOTP, verifyOTP } = require('../services/otpService');
const User = require('../models/userModel');
const Commission = require('../models/commissionModel');
const Referral = require('../models/referralModel');
const LevelPoints = require('../models/levelPoints');

dotenv.config();

// Send OTP via WhatsApp
const signupOTPHandler = async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ error: 'Phone number is required' });
  }
  const oldUser = await User.findByPhone(phone);
  if (oldUser) {
    return res.status(400).json({ error: 'User already exists', message: "User already exists please login" });
  }

  try {
    const otpRes = await sendOTP(phone);
    console.log(otpRes);

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error.message);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
};

const loginOtpHandler = async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  const oldUser = await User.findByPhone(phone);
  if (oldUser) {
    try {
      const otp = await sendOTP(phone);
      console.log(otp);
      res.status(200).json({ message: 'OTP sent successfully', otp });
    } catch (error) {
      console.error('Error sending OTP:', error.message);
      res.status(500).json({ error: 'Failed to send OTP' });
    }
  } else {
    res.status(400).json({ error: 'User not found', message: "User Not Found please signup first." });
  }


};

// Verify OTP
const verifyOTPHandler = async (req, res, next) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({ error: 'Phone number and OTP are required' });
  }

  try {
    await verifyOTP(phone, otp);
    next();
    // Generate a token upon successful verification
    // const token = jwt.sign({ phone }, process.env.JWT_SECRET, { expiresIn: '1h' });
    // res.status(200).json({ message: 'OTP verified successfully', token });
  } catch (error) {
    console.error('Error verifying OTP:', error.message);
    res.status(400).json({ error: error.message });
  }
};

// User signup
const signup = async (req, res) => {
  const { firstName, lastName, phone, referralCode } = req.body;

  // Check for required fields
  if (!firstName || !lastName || !phone) {
    return res.status(400).json({ error: 'First name, last name, and phone are required' });
  }

  try {
    let referrerId = null;

    // Validate referral code (if provided)
    if (referralCode) {
      const referrer = await User.findByReferralCode(referralCode);
      if (!referrer) {
        return res.status(400).json({ error: 'Invalid referral code' });
      }

      referrerId = referrer.id; // Set referrerId if referral code is valid
    }

    // Generate a unique referral code
    let newReferralcode = Math.random().toString(36).substring(2, 6).toUpperCase();
    let existingcode = await User.findByReferralCode(newReferralcode);
    while (existingcode) {
      newReferralcode = Math.random().toString(36).substring(2, 6).toUpperCase();
      existingcode = await User.findByReferralCode(newReferralcode);
    }

    // Create new user
    const userId = await User.createUser(firstName, lastName, phone, newReferralcode, referrerId); // userId is the insertId
    console.log("User created with ID:", userId);
    const getStage = await User.getAllStage();
    console.log("getStage:", getStage);
    const getStagePointsById = (id) => {
      const stage = getStage.find((item) => item.id === id);
      return stage ? stage.stage_points : 0; // Return stage_points if found, otherwise null
    };
    const stageId = 1; // ID of the stage you want to query
    const stagePoints = getStagePointsById(stageId);
    // If the user was referred, maintain the referral hierarchy and distribute points
    if (referrerId) {

      // add points to refferr
      await User.addPoints(referrerId, stagePoints);
      // Create the direct referral relationship (Level 1)
      await Referral.createReferral(referrerId, userId, 1); // Use userId instead of user

      // Get points for Level 1 (Direct referrer)
      const level1Points = await LevelPoints.getPointsByLevel(1); // Get points for Level 1
      if (level1Points && level1Points.active_status) {
        // Add commission (points) to the Level 1 referrer
        await Commission.createCommission(referrerId, level1Points.points, 1, userId); // Award commission to the referrer
      }

      // Get the upline users and their levels (for higher levels)
      const upline = await Referral.getUpline(referrerId);

      // Track that this user is referred only once, so loop stops after Level 1
      let levelReached = 1;
      for (const { userId: uplineUserId, level } of upline) {
        levelReached = level + 1; // Increment level for each higher-level user

        // Get points for this level
        const levelPoints = await LevelPoints.getPointsByLevel(levelReached);
        if (levelPoints && levelPoints.active_status) {
          // Add commission (points) to the upline user only once per signup
          await Commission.createCommission(uplineUserId, levelPoints.points, levelReached, userId); // Award commission
        }

        // If the referral reaches the top level, stop awarding commissions
        if (levelReached >= 3) { // Example: stop after 3 levels of commission
          break;
        }
      }
    }

    const newuser = await User.findByPhone(phone);
    if (!newuser) {
      return res.status(400).json({ error: 'User not found' });
    }

    // Generate JWT for the new user
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send success response
    console.log("User created successfully with ID:", userId);
    res.status(201).json({ message: 'User created successfully', token, newuser: { firstName: newuser.first_name, lastName: newuser.last_name, id: newuser.id, phone: newuser.phone, referralCode: newuser.referral_code } });
  } catch (error) {
    console.error('Error creating user:', error.message);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

// User login
const login = async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  try {
    const user = await User.findByPhone(phone);
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    // Generate JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(200).json({ message: 'Login successful', token, user: { firstName: user.first_name, lastName: user.last_name, id: user.id, phone: user.phone, referralCode: user.referral_code } });
  } catch (error) {
    console.error('Error logging in:', error.message);
    res.status(500).json({ error: 'Failed to login' });
  }
};







module.exports = { signupOTPHandler, loginOtpHandler, verifyOTPHandler, signup, login };