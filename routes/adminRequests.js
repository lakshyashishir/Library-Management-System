const express = require("express");
const router = express.Router();
const { auth } = require("../middleware");
const db = require("../db");

router.get("/", auth, async (req, res) => {
    db.query(
        "SELECT * FROM users WHERE role = 'admin requested'",
        (err, results) => {
            if (err) {
                res.status(500).json({ error: "Internal server error" });
                return;
            }
            
            res.render("adminRequests", { users: results });
        }
    );
});

router.post("/approve", auth, async (req, res) => {
    const  { user_id }= req.body;
    db.query(
        "UPDATE users SET role = 'admin' WHERE user_id = ?",
        [user_id],
        (err, results) => {
            if (err) {
                res.status(500).json({ error: "Internal server error" });
                return;
            }
            res.redirect("/admin");
        }
    );
});



module.exports = router;