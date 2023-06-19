const express = require("express");
const db = require("../db");
const { auth } = require("../middleware");
const { getBookTitlefromBookID, getUsernamefromUserID, getBookStatusfromBookID } = require("../utils");
const router = express.Router();

router.get("/", auth, (req, res) => {
  if (req.role !== "admin") {
    res.status(403).send({ msg: "User is not authorized to view requests" });
    return;
  }

  db.query("SELECT * FROM requests", async (err, results) => {
    if (err) {
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    let mappedResults = [];
    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      const bookTitle = await getBookTitlefromBookID(result.book_id);
      const username = await getUsernamefromUserID(result.user_id);
      const bookStatus = await getBookStatusfromBookID(result.book_id);

      mappedResults.push({
        request_id: result.request_id,
        book_id: result.book_id,
        user_id: result.user_id,
        request_status: result.book_status,
        book_title: bookTitle,
        username: username,
        book_status: bookStatus,
      });
    }

    res.render("requests", { requests: mappedResults  });
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
      // res.json({ message: "Book request approved successfully" });

      db.query(
        "SELECT book_id FROM requests WHERE request_id = ?",
        [requestId],
        (err, result) => {
          if (err) {
            res.status(500).json({ error: "Internal server error" });
            return;
          }
          const book_id = result[0].book_id;

          db.query(
            'UPDATE books SET status = "not available" WHERE book_id = ?',
            [book_id],
            (err, result) => {
              if (err) {
                res.status(500).json({ error: "Internal server error" });
                return;
              }
            }
          );
        }
      );
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
    'UPDATE requests SET book_status = "rejected" WHERE request_id = ?',
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
