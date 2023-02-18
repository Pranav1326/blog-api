const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');

// Register for Admin
exports.postAdminRegister = async (req, res) => {
    try{
        const checkadmin = await Admin.findOne({username: req.body.username});
        if(checkadmin){
            res.status(400).json({message: "User already exist!"});
        }
        else{
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            const newAdmin = new Admin({
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword
            });
            const admin = await newAdmin.save();
            res.status(200).json(admin);
        }
    }   
    catch(err) {
        res.status(500).json(err);
    }
}

// Login for Admin
exports.postAdminLogin = async (req, res) => {
    try{
        const admin = await Admin.findOne({username: req.body.username});
        !admin && res.status(400).json('User does not exist!');

        const validated = await bcrypt.compare(req.body.password, admin.password);
        !validated && res.status(400).json('Wrong credentials!');

        // Destructuring admin object fatched from db
        const {password, ...adminInfo} = admin._doc;
        const token = jwt.sign(
            adminInfo,
            "RANDOM-TOKEN",
            {expiresIn: "10m"}
        );
        res.status(200).json({adminInfo, token});
    }
    catch(err){
        res.status(500);
    }
}

// Update Admin
exports.updateAdmin = async (req, res) => {
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
}

// Delete Admin
exports.deleteAdmin = async (req, res) => {
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
}

// Get a single admin data
exports.getAdmin = async (req, res) => {
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
}

// Get all admins
exports.getAdmins = async (req, res) => {
    try {
        const admins = await Admin.find();
        admins && res.status(200).json(admins);
    } catch (err) {
        res.status(500).json(err);
    }
}

