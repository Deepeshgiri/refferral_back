const User = require('../models/userModel');
const Referral = require('../models/referralModel');
const userDashboard = require('../models/userDashboard');

const getAllReferrals = async(req, res) => {
  const { userId } = req.user;

  // Fetch all referrals for the user
  const network =await Referral.getallReferredUsers(userId)
  if(!network){
    res.status(400).json({error:"No network found"})
  } 
    
const details = await userDashboard.dashboard(userId)
if(!details){
  res.status(400).json({error:"No details found"})
}
  res.status(200).json({data:{network, details}  });

};

// Generate referral code
const generateReferralCode = (req, res) => {
  const { userId } = req.user;

  // Fetch user details
  User.findById(userId, (err, user) => {
    if (err || !user) {
      return res.status(400).json({ error: 'User not found' });
    }

    res.status(200).json({ referralCode: user.referral_code });
  });
};

// Track referral
const trackReferral = (req, res) => {
  const { referralCode } = req.body;
  const { userId } = req.user;

  // Find referrer by referral code
  User.findByReferralCode(referralCode, (err, referrer) => {
    if (err || !referrer) {
      return res.status(400).json({ error: 'Invalid referral code' });
    }

    // Create referral relationship
    Referral.createReferral(referrer.id, userId, 1, (err) => {
      if (err) return res.status(500).json({ error: 'Failed to track referral' });

      // Add points to referrer
      User.addPoints(referrer.id, 10, (err) => {
        if (err) return res.status(500).json({ error: 'Failed to add points' });
        res.status(200).json({ message: 'Referral tracked successfully' });
      });
    });
  });
};

module.exports = { generateReferralCode, trackReferral ,getAllReferrals};