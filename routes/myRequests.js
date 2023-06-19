const express = require("express");
const db = require("../db");
const { auth } = require("../middleware");
const { getBookTitlefromBookID } = require("../utils");
const router = express.Router();

router.get("/", auth, async (req, res) => {
    const user_id = req.userID;
  
    db.query(
      "SELECT * FROM requests WHERE user_id = ?",
      [user_id],
      async (err, results) => {
        if (err) {
          res.status(500).json({ error: "Internal server error" });
          return;
        }
        
        let mappedResults = [];
        for (let i = 0; i < results.length; i++) {
            const result = results[i];
            const bookTitle = await getBookTitlefromBookID(result.book_id);
        
            mappedResults.push({
                request_id: result.request_id,
                book_id: result.book_id,
                user_id: result.user_id,
                request_status: result.book_status,
                book_title: bookTitle,
            });
            }
        res.render("mybooks", { requests: mappedResults });
      }
    );
  });

module.exports = router;