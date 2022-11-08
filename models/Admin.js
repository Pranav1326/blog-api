const mongoose = require('mongoose');
// Declare the Schema of the Mongo model
var adminSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        index:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        min: 8
    },
    profilepic: {
        type: String,
        required: false,
        default: ""
    },
    articles: {
        type: Array,
        default: []
    },
    comments: {
        type: Array,
        default: []
    }
},{timestamps: true});

//Export the model
module.exports = mongoose.model('Admin', adminSchema);