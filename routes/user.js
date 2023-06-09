const express = require("express");
const db = require("../db");
const { auth } = require("../middleware");
const router = express.Router();
const { getUsernamefromUserID } = require("../utils");

router.post("/request", auth, (req, res) => {
  const { book_id } = req.body;
  const user_id = req.userID;

  const request = {
    book_id,
    user_id,
    book_status: "pending",
  };

  db.query("INSERT INTO requests SET ?", request, (err, result) => {
    if (err) {
      console.error("Error creating book request:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    db.query(
      'UPDATE books SET status = "requested" WHERE book_id = ?',
      [book_id],
      (err, result) => {
        if (err) {
          res.status(500).json({ error: "Internal server error" });
          return;
        }
        res.status(201).json({ message: "Book request created successfully" });
      }
    );
  });
});

router.post("/return", auth, (req, res) => {
  const { book_id } = req.body;
  const user_id = req.userID;

  db.query(
    "UPDATE books SET status = 'available' WHERE book_id = ? AND user_id = ?",
    [book_id],
    [user_id],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: "Internal server error" });
        return;
      }
    }
  );

  db.query(
    "delete from requests where book_id = ? AND user_id = ?",
    [book_id],
    [user_id],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: "Internal server error" });
        return;
      }
      res.json({ message: "Request removed successfully" });
    }
  );
  res.json({ message: "Book returned successfully" });
});

router.post("/removeRequest", auth, (req, res) => {
  const { requestId } = req.body;
  const user_id = req.userID;

  db.query(
    "DELETE FROM requests WHERE request_id = ? AND user_id = ?",
    [requestId, user_id],
    (err, result) => {
      if (err) {
        console.error("Error removing request:", err);
        res.status(500).json({ error: "Internal server error" });
        return;
      }
      res.json({ message: "Request removed successfully" });
    }
  );
});

router.get("/", auth, async (req, res) => {
  if (req.role !== "admin") {
    const username = await getUsernamefromUserID(req.userID);
    res.render("user", { username: username });
  } else {
    res.redirect("/admin");
  }
});

module.exports = router;
