const router = require('express').Router();
const bcrypt = require('bcrypt');

const Admin = require('../models/Admin');
const adminController = require('../controllers/admin');
const auth = require('../utils/auth');

// Create Admin
router.post('/register', adminController.postAdminRegister);

// Login Admin
router.post('/login', adminController.postAdminLogin);

// Update Admin
router.put('/update/:id',auth ,async (req, res) => {
    const authUser = await userAuth(req);
    if(authUser._id === req.body.userId && req.body.userId === req.params.id){
        if(req.body.password){
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }
        try{
            const updatedAdmin = await Admin.findByIdAndUpdate(req.params.id, {
                $set: req.body
            },{new: true});
            res.status(200).json(updatedAdmin);
        }
        catch(err){
            res.status(500).json(err);
        }
    }
    else{
        res.status(401).json(`You can update only your account!`);
    }
});

// DELETE Admin
router.delete('/delete/:id',auth , async (req, res) => {
    const authUser = await userAuth(req);
    if(authUser._id === req.body.userId && req.body.userId === req.params.id){
        const user = await Admin.findOne({_id : req.params.id});
        if(user){
            try{
                await Admin.findOneAndDelete(req.params.id);
                res.status(200).json(`User ${req.body.username} deleted`);
            }
            catch(err){
                res.status(500).json(err);
            }
        }
        else{
            res.status(401).json(`User not found!`);
        }
    }
    else{
        res.status(401).json(`You can Delete only your account!`);
    }
});

// Get single Admin
router.get('/:id', async (req, res) => {
    try{
        const admin = await Admin.findById(req.params.id);
        if(admin){
            const {password, ...otherInfo} = admin._doc;
            res.status(200).json(otherInfo);
        }
        else{
            res.status(400).json(`Admin ${req.body.username} not found`);
        }
    }
    catch(err) {
        res.status(500).json(err);
    }
}); 

module.exports = router;    