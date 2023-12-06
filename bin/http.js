require("dotenv").config();
const app = require("../index");

const host = process.env.HOST || "http://127.0.0.1";
const port = process.env.PORT || 3000;
app.listen(port)
console.log(`Running on ${host}:${port}`);
