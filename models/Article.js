const mongoose = require('mongoose');
// Declare the Schema of the Mongo model
var articleSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description: {
        type: String,
        required: true
    },
    content:{
        type:String,
        required:true,
    },
    author:{
        type:String,
        required:true,
    },
    authorId:{
        type:String,
        required:true,
    },
    tags:{
        type:Array,
        required:false,
    },
    comments: {
        type: Array,
        default: [],
    },
    viewCount: {
        type: Number,
        default: 0,
    },
    published: {
        type: Boolean,
        default: false,
    },
    image: {
        type: String,
        default: "https://drive.google.com/uc?id=1ZaDATIONGfu8RsjwOEkwGMtoHk4uMuWi",
    }
},{timestamps: true});

//Export the model
module.exports = mongoose.model('Article', articleSchema);