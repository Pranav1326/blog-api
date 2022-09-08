const mongoose = require('mongoose');

const dbConnection = mongoose.connect('mongodb://localhost:27017/testBlog')
.then((result) => {
    console.log('MongoDB connected!');
})
.catch((err) => {
    console.log(err);
})

module.exports = dbConnection;