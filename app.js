const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
const multer = require('multer');

const app = express();
app.use(cors());

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.use('/images', express.static('images'));
app.use(express.json());

const PORT = process.env.port || 5000;

// DB connection
const dbConnection = require('./utils/db');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  }
});

const upload = multer({storage: storage});
app.post("/api/imageupload", upload.single("file"), (req, res) => {
  console.log(req.body.name);
  try{
    res.status(200).json({message: "File uploaded Successfully.", path:`http://localhost:5000/images/${req.body.name}`});
  }
  catch(err){
    res.status(500).json(err);
  }
});

// Routes
const userRoute = require('./routes/user');
const adminRoute = require('./routes/admin');
const articleRoute = require('./routes/articles');
const tagRoute = require('./routes/tags');

// User route
app.use("/api/user", userRoute);

// Admin route
app.use("/api/admin", adminRoute);

// Article route
app.use("/api/articles", articleRoute);

// Tag route
app.use("/api/tags", tagRoute);

// Home Test Route
app.use("/", (req, res) => {
  res.status(200).json({ message: "This is home test route." });
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}/`);
});
