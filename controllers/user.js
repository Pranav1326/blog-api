const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcrypt');

// Register a new user
exports.postUserRegister = async (req, res) => {
    try{
        const checkUser = await User.findOne({username: req.body.username});
        if(checkUser){
            res.status(400).json({message: "User already exist!"});
        }
        else{
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            const newUser = new User({
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword
            });
            const user = await newUser.save();
            res.status(200).json(user);
        }
    }
    catch(err){
        res.status(500).json(err);
    }
}

// Fatching all the users
exports.getUsers = async (req, res) => {
    try{
        const user = await User.find()
        .then(result => res.status(200).json(result))
        .catch(e => res.status(401).json(e));

        !user && res.status(400).json('User not found!');
        
        res.status(200).json(user);
    }
    catch(err) {
        res.status(500);
    }
}

// User Login
exports.postUserLogin = async (req, res) => {
    try{
        const user = await User.findOne({username: req.body.username});
        !user && res.status(404).json('User does not exist!');

        const validated = await bcrypt.compare(req.body.password, user.password);
        !validated && res.status(400).json('Wrong credentials!');

        // Destructuring user object fatched from db
        const {password, ...userInfo} = user._doc;
        const token = jwt.sign(
            // {
            //   userId: user._id,
            //   username: user.username,
            // },
            userInfo,
            "RANDOM-TOKEN",
            {expiresIn: "10m"}
        );
        res.status(200).json({userInfo, token});
    }
    catch(err){
        res.status(500);
    }
}

// Moved to user routes

// {

// User Update
// exports.putUser = async (req, res) => {
//     try{
        
//     }
//     catch(err){
//         res.status(500).json(err);
//     }
// }

// User Delete
// exports.deleteUser = async (req, res) => {
//     try{

//     }
//     catch(err){
//         res.status(500).json(err);
//     }
// }

// }