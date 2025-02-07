const Reward = require('../models/reward');

const getAllRewards = async (req, res) => {
  try {
    const rewards = await Reward.getAllRewards();
    res.json(rewards);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getRewardById = async (req, res) => {
  try {
    const reward = await Reward.getRewardById(req.params.id);
    if (!reward) return res.status(404).json({ error: 'Reward not found' });
    res.json(reward);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createReward = async (req, res) => {
  try {
    const { name, points_required, min_ref, description, image_url, is_active } = req.body;
    const rewardId = await Reward.createReward(name, points_required, min_ref, description, image_url, is_active);
    res.status(201).json({ message: 'Reward created', id: rewardId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateReward = async (req, res) => {
  try {
    const { name, points_required, min_ref, description, image_url, is_active } = req.body;
    await Reward.updateReward(req.params.id, name, points_required, min_ref, description, image_url, is_active);
    res.json({ message: 'Reward updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteReward = async (req, res) => {
  try {
    await Reward.deleteReward(req.params.id);
    res.json({ message: 'Reward deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllRewards, getRewardById, createReward, updateReward, deleteReward };
