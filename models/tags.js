const mongoose = require('mongoose');
// Declare the Schema of the Mongo model
var tagsSchema = new mongoose.Schema({
    name:{
        type:String,
        unique:true,
        index:true,
    }
});

//Export the model
module.exports = mongoose.model('tags', tagsSchema);