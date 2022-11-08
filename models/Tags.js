const mongoose = require('mongoose');
// Declare the Schema of the Mongo model
var tagsSchema = new mongoose.Schema({
    tag:{
        type: String,
        index: true,
    }
});

//Export the model
module.exports = mongoose.model('Tags', tagsSchema);