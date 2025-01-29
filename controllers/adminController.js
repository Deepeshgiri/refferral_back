const Admin = require('../models/adminModel');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/userModel');

dotenv.config();

// Admin login
const adminLogin = async (req, res) => {
  const { userName, password } = req.body;
  console.log(req.body)
  if (!userName || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  const admin = await Admin.findByUsername(userName)
  if (!admin || password !== admin.password) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }
  // Generate JWT
  const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
  res.status(200).json({ message: 'Admin login successful', token });
};


// Update user details
// const updateUser = async(req, res) => {
//   const { id, first_name, phone, stage } = req.body;
// console.log(req.body)
//   const updatUser = await Admin.updateUser(id, first_name, phone, stage)
//   if (!updatUser) {
//     return res.status(400).json({ error: 'User not found' });
//   }
//   res.status(200).json({ message: 'User updated successfully' });

// };

const updateUser = async (req, res) => {
  let { id, first_name, phone, stage } = req.body;
  console.log(req.body);
  stage = parseInt(stage);

  try {
    // Fetch the current user data
    const currentUser = await User.findById(id); // Assuming you have a method to get user by ID
    if (!currentUser) {
      return res.status(400).json({ error: 'User not found' });
    }

    const referrerId = currentUser.referred_by;
   
    // Check if the stage is being updated
    if (stage && stage !== currentUser.stage) {
      const getStage = await User.getAllStage();
      console.log("getStage:", getStage);
      const getStagePointsById = (id) => {
        const stagePointsFromResult = getStage.find((item) => item.id === id);
        return stagePointsFromResult ? stagePointsFromResult.stage_points : 0; // Return stage_points if found, otherwise null
      };
      const stageId = stage; // ID of the stage you want to query
      const stagePoints = getStagePointsById(stageId);
      // Perform the additional task here
      if (stage > currentUser.stage) {
        await User.addPoints(referrerId, stagePoints);
      }
      console.log(`Stage updated from ${currentUser.stage} to ${stage}`);
 
    }

    // Update the user
    const updatedUser = await Admin.updateUser(id, first_name, phone, stage);

    if (!updatedUser) {
      return res.status(400).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};





// Get all users
const getAllUsers = async (req, res) => {
  const users = await Admin.getAllUsers()
  if (!users) return res.status(500).json({ error: 'Failed to fetch users' });
  //console.log("users",users)

  res.status(200).json({ users });

};

module.exports = { adminLogin, updateUser, getAllUsers };