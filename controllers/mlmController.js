const Referral = require('../models/referralModel');
const Commission = require('../models/commissionModel');

// Get downline users
const getDownline = (req, res) => {
  const { userId } = req.user;
  const { level } = req.params;

  Referral.getDownline(userId, level, (err, downline) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch downline' });
    res.status(200).json({ downline });
  });
};

// Calculate commissions
const calculateCommissions = (req, res) => {
  const { userId } = req.user;

  // Fetch downline users
  Referral.getReferralsByUser(userId, (err, referrals) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch referrals' });

    let totalCommission = 0;

    // Calculate commissions for each level
    referrals.forEach((referral) => {
      const commissionAmount = referral.level * 10; // Example: $10 per level
      Commission.createCommission(userId, commissionAmount, referral.level, (err) => {
        if (err) return res.status(500).json({ error: 'Failed to calculate commissions' });
        totalCommission += commissionAmount;
      });
    });

    res.status(200).json({ totalCommission });
  });
};

module.exports = { getDownline, calculateCommissions };