const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
const multer = require('multer');

const app = express();
app.use(cors());

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());

// DB connection
const dbConnection = require('./utils/db');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  }
});

const upload = multer({storage: storage});
app.post("/api/imageupload", upload.single("file"), (req, res) => {
  console.log(req.body);
  res.status(200).json("File uploaded Successfully.");
});

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
