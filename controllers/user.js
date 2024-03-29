const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const userAuth = require('../utils/userAuth');
const dotenv = require('dotenv').config();

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "mernstack.blog@gmail.com",
      pass: "vyzghijrhhcodwgr",
    },
});

// Register a new user
exports.postUserRegister = async (req, res) => {
    try{
        const checkUser = await User.findOne({username: req.body.username});
        if(checkUser){
            res.status(400).json("User already exist!");
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
            let info = await transporter.sendMail({
                from: 'mernstack.blog@gmail.com',
                to: `${req.body.email}`,
                subject: "Greeting from blog website",
                html: `<p>Hello ${req.body.username},</p> \n<p>Welcome to out blog website you can read articles and even write your own article. It's just easy as writing in text file.`
            });
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

// Fetch a sinle user
exports.getUser = async (req, res) => {
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
            userInfo,
            process.env.TOKEN_KEY
        );
        res.status(200).json({userInfo, token});
    }
    catch(err){
        res.status(500);
    }
}

// Update User
exports.updateUser = async (req, res) => {
    const authUser = await userAuth(req);
    if(authUser._id === req.body.userId && req.body.userId === req.params.id){
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
}

// Delete User
exports.deleteUser = async (req, res) => {
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
            res.status(404).json(`User not found!`);
        }
    }
    else{
        res.status(401).json(`You can Delete only your account!`);
    }
}

// Forgot Password
let otp;

const generateOtp = () => {;    
    otptemp = Math.floor(Math.random()*10000);
    if(otptemp.toString().length<4){
        generateOtp();
    }
    return otptemp;
}

// forgot Passoword
exports.forgotPassword = async (req, res) => {
    let info;
    try {
        const email = req.body.email;
	    const checkUser = await User.findOne({email: email});
	    if(!checkUser){
            res.status(404).json("User does not exist! Please create new user.");
	    }
	    else{
            if(checkUser.email === email){
                otp = generateOtp();
	            info = await transporter.sendMail({
	                from: 'mernstack.blog@gmail.com',
	                to: `${req.body.email}`,
	                subject: "Forgot Password Instructions of blog website",
	                text: ``,
                    html: `Hello ${req.body.email}<p>Someone has requested a link to change your password.</p><p>Here your one time password(OTP) <b>${otp}</b></p>`
	            });
	        }
	        else{
	            res.status(404).json("User does not exist! Please create new user.");
	        }
	        if(info !== null){
	            res.status(200).json("mail has been sent!");
	        }
	        if(!info){
	            res.status(500).json("Could not send the mail!");
	        }
	    }
    } catch (error) {
        res.status(500).json("Could not send the mail!");
    }
}

// Change Password
exports.changePassword = async (req, res) => {
    try {
        const userId = req.body.userId;
        const authUser = await userAuth(req);
        if(authUser._id === userId){
            const user = await User.findOneAndUpdate({ _id: userId });
            !user && res.status(404).json('User does not exist!');
            
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            
            if(user){
                const updatedUser = await User.findByIdAndUpdate(user._id, {
                    $set: req.body,
                    password: hashedPassword
                },{new: true});
                updatedUser && res.status(200).json("Password Changed Successfully");
            }
        }
        else{
            res.status(401).json("Not Authorised!");
        }
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

// Reset Password
exports.resetPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        !user && res.status(404).json('User does not exist!');
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        
        if(user){
            const updatedUser = await User.findByIdAndUpdate(user._id, {
                $set: req.body,
                password: hashedPassword
            },{new: true});
            otp=null;
            res.status(200).json(updatedUser);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

// OTP Auth
exports.otpAuth = async (req, res) => {
    const otpReq = req.body.otp;
    try {
        if(Number(otpReq) === otp){
            res.status(200).json("Authenticated");
            otp = null;
        }
        else{
            res.status(400).json("Invalid OTP!");
        }
    } catch (error) {
        res.status(500).json(error);
    }
}