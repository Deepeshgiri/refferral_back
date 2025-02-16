const express = require('express');
const router = express.Router();

// Import controllers
const authController = require('../controllers/authController');
const referralController = require('../controllers/referralController');

const userController = require('../controllers/userController');
const adminController = require('../controllers/adminController');
const userDashboardController = require('../controllers/userDashboardController');
const stageController = require('../controllers/stageController');

// Import middleware
const { authenticateUser } = require('../middleware/authMiddleware');
const { authenticateAdmin } = require('../middleware/authMiddleware');
const { getAllRewards , getRewardById, createReward, updateReward, deleteReward} = require('../controllers/rewardControllers');
const dynamicUpload = require('../utils/Cloudinary');

router.get('/testing', (req, res) => {
    res.send('Hello World!');
});

// Auth routes
// router.post('/send-otp', authController.signupOTPHandler); // Send OTP via WhatsApp
// router.post('/verify-otp', authController.verifyOTPHandler); // Verify OTP and create user
// router.post('/login', authController.login); // User login
router.post('/api/signup', authController.signupOTPHandler); // User signup
router.post('/api/signup/verify-otp', authController.verifyOTPHandler, authController.signup)
router.post('/api/login/send-otp', authController.loginOtpHandler);
router.post('/api/login/verify-otp', authController.verifyOTPHandler,authController.login);


// Referral routes
router.post('/generate-referral-code', authenticateUser, referralController.generateReferralCode); // Generate referral code
router.post('/track-referral', authenticateUser, referralController.trackReferral); // Track referral




// User routes
router.get('/api/user/dashboard', authenticateUser,userDashboardController.dashboard );
router.get('/api/userdetails',authenticateUser,)
router.post('/update-stage', authenticateUser, userController.updateStage); // Update user stage
router.get('/user-progress/:userId', authenticateUser, userController.getUserProgress); // Fetch user progress
router.get('/api/referral/recent-act',authenticateUser, userDashboardController.getRecentActivities)

router.get('/api/referrals/list', authenticateUser, referralController.getAllReferrals);

// Admin routes
router.post('/api/admin/login', adminController.adminLogin); // Admin login
router.put('/api/admin/update-user', authenticateAdmin, adminController.updateUser); // Update user details
router.get('/api/admin/users', authenticateAdmin, adminController.getAllUsers); // Get all users

router.get('/api/admin/stages', authenticateAdmin, stageController.getAllStages)
router.put('/api/admin/stages/:stageId', authenticateAdmin, stageController.updateStage);



//reward routes 

router.get('/rewards', getAllRewards);
router.get('/:id', getRewardById);
router.post('/rewards', authenticateAdmin, dynamicUpload('rewards'), createReward);
router.put('/:id',authenticateAdmin, updateReward);
router.delete('/rewards/:id', authenticateAdmin, deleteReward);



module.exports = router;