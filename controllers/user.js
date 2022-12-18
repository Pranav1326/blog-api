const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

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
            "RANDOM-TOKEN"
        );
        res.status(200).json({userInfo, token});
    }
    catch(err){
        res.status(500);
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

// Reset Password
exports.resetPassword = async (req, res) => {
    try {
        const user = await User.findOne({email: req.body.email});
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