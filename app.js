const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());

// DB connection
const dbConnection = require('./utils/db');

// Routes
const userRoute = require('./routes/user');
const adminRoute = require('./routes/admin');
const articleRoute = require('./routes/articles');

// User route
app.use("/api/user", userRoute);

// Admin route
app.use("/api/admin", adminRoute);

// Article route
app.use("/api/articles", articleRoute);

app.listen(5000, () => {
  console.log(`Server started on http://localhost:5000/`);
});
