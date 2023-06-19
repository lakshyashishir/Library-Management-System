const express = require("express");
const db = require("../db");
const { auth } = require("../middleware");
const { getBookTitlefromBookID, getUsernamefromUserID, getBookStatusfromBookID } = require("../utils");
const router = express.Router();

router.get("/", auth, async (req, res) => {
    if (req.role !== "admin") {
        res.redirect("/user");
        return;
        }

    
  
    db.query(
      "SELECT * FROM requests",
      async (err, results) => {
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
        res.render("issuedBooks", { requests: mappedResults });
      }
    );
  }
);

module.exports = router;