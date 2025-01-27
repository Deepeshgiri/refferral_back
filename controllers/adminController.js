const Admin = require('../models/adminModel');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

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
const updateUser = async(req, res) => {
  const { id, first_name, phone, stage } = req.body;
console.log(req.body)
  const updatUser = await Admin.updateUser(id, first_name, phone, stage)
  if (!updatUser) {
    return res.status(400).json({ error: 'User not found' });
  }
  res.status(200).json({ message: 'User updated successfully' });

};

// Get all users
const getAllUsers = async (req, res) => {
  const users =await Admin.getAllUsers()
    if (!users) return res.status(500).json({ error: 'Failed to fetch users' });
    //console.log("users",users)
    
    res.status(200).json({ users });
  
};

module.exports = { adminLogin, updateUser, getAllUsers };