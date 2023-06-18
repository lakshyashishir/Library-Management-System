const express = require("express");
const db = require("../db");
const {auth}= require("../middleware");
const router = express.Router();

router.get("/requests", auth, (req, res) => {
  if (req.role !== "admin") {
    res.status(403).send({ msg: "User is not authorized to view requests" });
    return;
  }

  db.query("SELECT * FROM requests", (err, results) => {
    if (err) {
      console.error("Error retrieving requests:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    res.json(results);
  });
});

router.post("/approve", auth, (req, res) => {
  if (req.role !== "admin") {
    res.status(403).send({ msg: "User is not authorized to approve requests" });
    return;
  }

  const { requestId } = req.body;

  db.query(
    'UPDATE requests SET book_status = "approved" WHERE request_id = ?',
    [requestId],
    (err, result) => {
      if (err) {
        console.error("Error approving book request:", err);
        res.status(500).json({ error: "Internal server error" });
        return;
      }
      res.json({ message: "Book request approved successfully" });
    }
  );
});

router.post("/reject", auth, (req, res) => {
  if (req.role !== "admin") {
    res.status(403).send({ msg: "User is not authorized to reject requests" });
    return;
  }

  const { requestId } = req.body;

  db.query(
    "DELETE FROM requests WHERE request_id = ?",
    [requestId],
    (err, result) => {
      if (err) {
        console.error("Error rejecting book request:", err);
        res.status(500).json({ error: "Internal server error" });
        return;
      }
      res.json({ message: "Book request rejected successfully" });
    }
  );
});

module.exports = router;
