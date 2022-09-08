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