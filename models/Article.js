const mongoose = require('mongoose');
// Declare the Schema of the Mongo model
var articleSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    content:{
        type:String,
        required:true,
    },
    author:{
        type:String,
        required:true,
    },
    tags:{
        type:Array,
        required:false,
    },
    comments: {
        type: Array,
        default: []
    }
},{timestamps: true});

//Export the model
module.exports = mongoose.model('Article', articleSchema);