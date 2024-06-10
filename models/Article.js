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
        default: "https://pranav1326.github.io/images/blog-cover.jpg",
    }
},{timestamps: true});

//Export the model
module.exports = mongoose.model('Article', articleSchema);