const auth = require('../utils/auth');
const router = require('express').Router();

const userController = require('../controllers/user');

// Create User
router.post('/register', userController.postUserRegister);

// Login User
router.post('/login', userController.postUserLogin);

// Forgot Password
router.post('/forgotpassword', userController.forgotPassword);

// otp auth
router.post('/otpauth', userController.otpAuth);

// Change Password
router.post('/changepassword', auth, userController.changePassword);

// Reset Forgot Password
router.put('/resetpassword', userController.resetPassword);

// UPDATE User
router.put('/update/:id', auth, userController.updateUser);

// DELETE User
router.delete('/delete/:id', auth, userController.deleteUser);

// Get single user
router.get('/:id', userController.getUser); 

// Get all the users
router.get('/', userController.getUsers);

module.exports = router;
