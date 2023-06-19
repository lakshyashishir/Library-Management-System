const express = require("express");
const db = require("../db");
const {auth}= require("../middleware");
const router = express.Router();

router.get("/", auth, (req, res) => {
    db.query("SELECT * FROM books", (err, results) => {
        if (err) {
        res.status(500).json({ error: "Internal server error" });
        return;
        }
        res.render("getbook", { books: results });
    }
    );
});

module.exports = router;