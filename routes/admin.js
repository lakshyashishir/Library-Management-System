const express = require("express");
const db = require("../db");
const { auth } = require("../middleware");
const { getBookTitlefromBookID, getUsernamefromUserID } = require("../utils");
const router = express.Router();

router.get("/", auth, async (req, res) => {
    if (req.role !== "admin") {
    res.redirect("/user");
    }
  const username = await getUsernamefromUserID(req.userID);
  res.render("admin", { username: username });
});

module.exports = router;
