const express = require('express');
const router = express.Router();

// Import controllers
const authController = require('../controllers/authController');
const referralController = require('../controllers/referralController');
const mlmController = require('../controllers/mlmController');
const userController = require('../controllers/userController');
const adminController = require('../controllers/adminController');
const userDashboardController = require('../controllers/userDashboardController');

// Import middleware
const { authenticateUser } = require('../middleware/authMiddleware');
const { authenticateAdmin } = require('../middleware/authMiddleware');



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

// MLM routes
router.get('/downline/:level', authenticateUser, mlmController.getDownline); // Get downline users
router.post('/calculate-commissions', authenticateUser, mlmController.calculateCommissions); // Calculate commissions




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

module.exports = router;