const express = require("express");
const db = require("../db");
const router = express.Router();

router.post("/", (req, res) => {
    res.clearCookie("token");
    res.redirect("/");
});

module.exports = router;
