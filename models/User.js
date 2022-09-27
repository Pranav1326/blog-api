const mongoose = require('mongoose');
// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true
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
    },
    name:{
        type: String,
    },
    location:{
        type: String,
    },
    bio:{
        type: String,
    },
    work:{
        type: String,
    },
},{timestamps: true});

//Export the model
module.exports = mongoose.model('User', userSchema);