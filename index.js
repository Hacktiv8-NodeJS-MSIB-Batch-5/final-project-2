require("dotenv").config();
const express = require("express");
const routes = require("./routes");

const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use("/", routes);

// handle 404
app.use((req, res, next) => {
  res.status(404).send({
      message: "Not found",
  });
});

// handle error
app.use((err, req, res, next) => {
  res.status(500).send({
      message: "Internal Server Error",
  });
});

const host = process.env.HOST || "http://127.0.0.1";
const port = process.env.PORT || 3000;
app.listen(port)
console.log(`Running on ${host}:${port}`);
