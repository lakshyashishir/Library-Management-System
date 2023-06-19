const express = require("express");
require("dotenv").config();
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const path = require("path");
const db = require("./db");
db.connect();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));

const loginRoute = require("./routes/login");
const signupRoute = require("./routes/signup");
const addBookRoute = require("./routes/addBook");
const adminRoute = require("./routes/admin");
const userRoute = require("./routes/user");
const logoutRoute = require("./routes/logout");
const requestsRoute = require("./routes/requests");
const myRequestsRoute = require("./routes/myRequests");
const myBooksRoute = require("./routes/myBooks");
const getBookRoute = require("./routes/getBook");
const reqAdminRoute = require("./routes/reqAdmin");
const adminRequestsRoute = require("./routes/adminRequests");

const { auth } = require("./middleware");

app.use("/login", loginRoute);
app.use("/signup", signupRoute);
app.use("/addBook", addBookRoute);
app.use("/admin", adminRoute);
app.use("/user", userRoute);
app.use("/requests", requestsRoute);
app.use("/logout", logoutRoute);
app.use("/myrequests", myRequestsRoute);
app.use("/getbook", getBookRoute);
app.use("/mybooks", myBooksRoute);
app.use("/reqAdmin", reqAdminRoute);
app.use("/adminRequests", adminRequestsRoute);




app.get("/", (req, res) => {
  res.render("landingPage");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.get("/addBook", auth,async (req, res) => {
  res.render("addBook");  
});

app.get("/requests", auth,async (req, res) => {
  res.render("requests");
});


app.listen(PORT, (error) => {
  if (!error) {
    console.log(
      "Server is Successfully Running, and App is listening on port: " + PORT
    );
  } else {
    console.log("Error occurred, server can't start", error);
  }
});



