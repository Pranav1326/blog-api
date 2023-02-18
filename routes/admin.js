const router = require('express').Router();
const bcrypt = require('bcrypt');

const adminController = require('../controllers/admin');
const auth = require('../utils/auth');

// Create Admin
router.post('/register', adminController.postAdminRegister);

// Login Admin
router.post('/login', adminController.postAdminLogin);

// Update Admin
router.put('/update/:id',auth ,adminController.updateAdmin);

// DELETE Admin
router.delete('/delete/:id',auth , adminController.deleteAdmin);

// Fetch single Admin
router.get('/:id', adminController.getAdmin); 

// Fetch all Admins
router.get('/', adminController.getAdmins);

module.exports = router;    