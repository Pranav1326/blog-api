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
    image: {
        type: String,
        default: "https://blog-api-c8j7.onrender.com/images/blog.jpg",
    }
},{timestamps: true});

//Export the model
module.exports = mongoose.model('Article', articleSchema);