const express = require("express");
require("dotenv").config();
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const db = require("./db");
db.connect();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

const loginRoute = require("./routes/login");
const signupRoute = require("./routes/signup");
const addBookRoute = require("./routes/addBook");
const requestRoute = require("./routes/request");
const userRoute = require("./routes/user");

app.use("/login", loginRoute);
app.use("/signup", signupRoute);
app.use("/addBook", addBookRoute);
app.use("/request", requestRoute);
app.use("/user", userRoute);


app.listen(PORT, (error) => {
  if (!error) {
    console.log(
      "Server is Successfully Running, and App is listening on port: " + PORT
    );
  } else {
    console.log("Error occurred, server can't start", error);
  }
});
