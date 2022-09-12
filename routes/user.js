const auth = require('../utils/auth');
const userAuth = require('../utils/userAuth');
const router = require('express').Router();
const bcrypt = require('bcrypt');

const User = require('../models/User');
const userController = require('../controllers/user');

// Create User
router.post('/register', userController.postUserRegister);

// Login User
router.post('/login', userController.postUserLogin);

// UPDATE User
router.put('/update/:id',auth ,async (req, res) => {
    const authUser = await userAuth(req);
    if(authUser._id === req.body.userId && req.body.userId === req.params.id){
        if(req.body.password){
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }
        try{
            const updatedUser = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body
            },{new: true});
            res.status(200).json(updatedUser);
        }
        catch(err){
            res.status(500).json(err);
        }
    }
    else{
        res.status(401).json(`You can update only your account!`);
    }
});

// DELETE User
router.delete('/delete/:id',auth , async (req, res) => {
    const authUser = await userAuth(req);
    if(authUser._id === req.body.userId && req.body.userId === req.params.id){
        const user = await User.findOne({_id : req.body.userId});
        if(user){
            try{
                await User.findOneAndDelete({_id: req.body.userId});
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

// Get single user
router.get('/:id', async (req, res) => {
    try{
        const user = await User.findById({_id: req.params.id});
        if(user){
            const {password, ...otherInfo} = user._doc;
            res.status(200).json(otherInfo);
        }
        else{
            res.status(400).json(`User ${req.body.username} not found`);
        }
    }
    catch(err) {
        res.status(500).json(err);
    }
}); 

// Get all the users
router.get('/', userController.getUsers);

module.exports = router;