const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.get("/", (req, res) => {
  res.send(`Hello from server`);
});

app.listen(5000, () => {
  console.log(`Server started on http://localhost:5000/`);
});
