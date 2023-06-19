const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
const multer = require('multer');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app = express();
app.use(cors());

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.use('/images', express.static('images'));
app.use(express.json());
app.use('/api/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 5000;

// DB connection
const dbConnection = require('./utils/db');

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'public/images');
  },
  filename: (req, file, callback) => {
    callback(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage: storage });

app.post("/api/imageupload", upload.single('file'), (req, res) => {
  const { protocol, hostname } = req;
  const port = process.env.PORT || PORT;
  const uploadFile = req.file;
  try{
    res.status(200).json({message: "File uploaded Successfully.", path:`${protocol}://${hostname}/${uploadFile.destination.split('/')[1]}/${uploadFile.filename}`});
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
const commentRoute = require('./routes/comment');

// User route
app.use("/api/user", userRoute);

// Admin route
app.use("/api/admin", adminRoute);

// Article route
app.use("/api/articles", articleRoute);

// Tag route
app.use("/api/tags", tagRoute);

// Comment route
app.use(`/api/comment`, commentRoute);

// Home Test Route
app.get("/", (req, res) => {
  res.status(200).json({ message: "This is home test route." });
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}/`);
});