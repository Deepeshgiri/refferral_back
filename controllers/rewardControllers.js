// const Reward = require('../models/reward');

// const getAllRewards = async (req, res) => {
//   try {
//     const rewards = await Reward.getAllRewards();
//     console.log(rewards)
//     res.status(200).json({data:rewards});
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// const getRewardById = async (req, res) => {
//   try {
//     const reward = await Reward.getRewardById(req.params.id);
//     if (!reward) return res.status(404).json({ error: 'Reward not found' });
//     res.json(reward);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// const createReward = async (req, res) => {
//   console.log(req.body)
//   try {
//     const { name, points_required, min_ref, description, image_url, is_active } = req.body;
//     const rewardId = await Reward.createReward(name, points_required, min_ref, description, image_url, is_active);
//     res.status(201).json({ message: 'Reward created', id: rewardId });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// const updateReward = async (req, res) => {
//   try {
//     const { name, points_required, min_ref, description, image_url, is_active } = req.body;
//     await Reward.updateReward(req.params.id, name, points_required, min_ref, description, image_url, is_active);
//     res.json({ message: 'Reward updated' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// const deleteReward = async (req, res) => {
//   try {
//     await Reward.deleteReward(req.params.id);
//     res.json({ message: 'Reward deleted' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// module.exports = { getAllRewards, getRewardById, createReward, updateReward, deleteReward };




const Reward = require('../models/reward');
const cloudinary = require('cloudinary').v2;

// Get all rewards
const getAllRewards = async (req, res) => {
  try {
    const rewards = await Reward.getAllRewards();
    res.status(200).json({ data: rewards });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single reward by ID
const getRewardById = async (req, res) => {
  try {
    const reward = await Reward.getRewardById(req.params.id);
    if (!reward) return res.status(404).json({ error: 'Reward not found' });
    res.json(reward);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new reward (Upload image and save details)
const createReward = async (req, res) => {
  try {
    console.log(req.body);
    
    if (!req.file) {
      return res.status(400).json({ error: "Image file is required" });
    }

    const { name, points_required, min_ref, description, is_active } = req.body;
    const image_url = req.file.cloudinary.secure_url; // Get image URL from Cloudinary

    const rewardId = await Reward.createReward(name, points_required, min_ref, description, image_url, is_active);
    res.status(201).json({ message: 'Reward created', id: rewardId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a reward (Replace old image if a new one is uploaded)
const updateReward = async (req, res) => {
  try {
    const { name, points_required, min_ref, description, is_active, oldImageUrl } = req.body;
    let image_url = oldImageUrl; // Keep the old image if no new one is uploaded

    if (req.file) {
      // Upload new image and delete the old one
      image_url = req.file.path;
      if (oldImageUrl) {
        const publicId = oldImageUrl.split('/').pop().split('.')[0]; // Extract public_id
        await cloudinary.uploader.destroy(publicId);
      }
    }

    await Reward.updateReward(req.params.id, name, points_required, min_ref, description, image_url, is_active);
    res.json({ message: 'Reward updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a reward and remove its image from Cloudinary
const deleteReward = async (req, res) => {
  console.log(req.params.id)
  try {
    const reward = await Reward.getRewardById(req.params.id);
    console.log(reward)
    if (!reward) return res.status(404).json({ error: "Reward not found" });

    if (reward.image_url) {
      const publicId = reward.image_url.split('/').pop().split('.')[0]; // Extract public_id
      await cloudinary.uploader.destroy(publicId);
    }

    await Reward.deleteReward(req.params.id);
    res.json({ message: "Reward deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllRewards, getRewardById, createReward, updateReward, deleteReward };
