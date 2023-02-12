const mongoose = require('mongoose');
// Declare the Schema of the Mongo model
const commentSchema = new mongoose.Schema({
    comment:{
        type: String,
        require: true,
    },
    author: {
        type: String,
        require: true,
    },
    authorId: {
        type: String,
        require: true,
    },
    article: {
        type: String,
        require: true,
    },
    articleId: {
        type: String,
        require: true,
    }
},{timestamps: true});

//Export the model
module.exports = mongoose.model('Comment', commentSchema);