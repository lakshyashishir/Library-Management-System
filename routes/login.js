const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../db");
const crypto = require("crypto");
const router = express.Router();

router.post("/", async (req, res) => {
  const { username, password } = req.body;

  db.query(
    `SELECT user_id, hash, role FROM users WHERE username = ?`,
    [username],
    async (err, results) => {
      if (err) {
        throw err;
      } else {
        if (results.length === 0) {
          console.log(`Incorrect login attempt for ${username}`);
          return;
        }

        const user = results[0];
        const hash = user.hash;

        const isPasswordValid = await bcrypt.compare(password, hash);

        if (isPasswordValid) {
          console.log(`${username} logged in!`);

          const sessionId = crypto.randomUUID();
          res.cookie("sessionId", sessionId, {
            maxAge: 12000000,
            httpOnly: true,
          });

          db.query(
            `INSERT INTO cookies (sessionId, userId) VALUES (?, ?)`,
            [sessionId, user.user_id],
            (err) => {
              if (err) {
                throw err;
              }
              res.role = user.role;
              if (res.role === "admin") {
                console.log("admin");
              } else {
                console.log("user");
              }
            }
          );
        } else {
          console.log(`Incorrect login attempt for ${username}`);
        }
      }
    }
  );
});

module.exports = router;
