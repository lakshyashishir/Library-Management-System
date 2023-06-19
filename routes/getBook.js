const express = require("express");
const db = require("../db");
const {auth}= require("../middleware");
const router = express.Router();

router.get("/", auth, (req, res) => {
    res.render("getBook");
});

router.post("/search", auth, (req, res) => {
    const {bookTitle} = req.body;

    db.query("SELECT * FROM books WHERE title LIKE ?", [`%${bookTitle}%`], (err, results) => {
        if (err) {
        res.status(500).json({ error: "Internal server error" });
        return;
        }
        res.render("booklist", { books: results });
    });
 }
);

module.exports = router;