const express = require("express");
const db = require("../db");
const {auth}= require("../middleware");
const router = express.Router();

router.post("/", auth, (req, res) => {
  if (req.role !== "admin") {
    res.status(403).send({ msg: "User cannot add books" });
    return;
  }

  const { title, author, quantity } = req.body;

  const book = {
    title,
    author,
    status: "available",
    quantity,
  };

  db.query("INSERT INTO books SET ?", book, (err, result) => {
    if (err) {
      console.error("Error creating book:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    res.status(201).json({ message: "Book created successfully" });
  });
});

module.exports = router;
