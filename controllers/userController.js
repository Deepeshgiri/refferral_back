const User = require('../models/userModel');

// Update user stage
const updateStage = (req, res) => {
  const { userId } = req.user;
  const { stage } = req.body;

  User.updateStage(userId, stage, (err) => {
    if (err) return res.status(500).json({ error: 'Failed to update stage' });
    res.status(200).json({ message: 'Stage updated successfully' });
  });
};



// Fetch user progress
const getUserProgress = (req, res) => {
  const { userId } = req.params;

  User.findById(userId, (err, user) => {
    if (err || !user) {
      return res.status(400).json({ error: 'User not found' });
    }
    res.status(200).json({ user });
  });
};



module.exports = { updateStage, getUserProgress };