const mongoose = require('mongoose');
require('dotenv').config();

const dbConnection = mongoose.connect(`mongodb+srv://${process.env.MONGODB_PROFILE}:${process.env.MONGODB_PASSWORD}@cluster0.5kh5v.mongodb.net/?retryWrites=true&w=majority`,
{
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then((result) => {
    console.log('MongoDB connected!');
})
.catch((err) => {
    console.log(err);
})

module.exports = dbConnection;