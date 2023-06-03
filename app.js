const express = require("express");
require("dotenv").config();
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const db = require("./db");
db.connect();

const app = express();
const PORT = process.env.PORT || 3000;

async function hashPassword(password) {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(password, salt);

  return {
    salt: salt,
    hash: hash,
  };
}

app.use(express.json());

app.post("/users", async (req, res) => {
  const { username, password, role } = req.body;
  var pass = await hashPassword(password);
  const hash = pass.hash;
  const salt = pass.salt;

  const user = {
    username,
    hash,
    salt,
    role,
  };

  db.query("INSERT INTO users SET ?", user, (err, result) => {
    if (err) {
      console.error("Error creating user:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    res.status(201).json({ message: "User created successfully" });
  });
});

app.post("/books", (req, res) => {
  const { title, author } = req.body;

  const book = {
    title,
    author,
    book_status: "available",
    borrower_id: null,
    checkout_date: null,
    return_date: null,
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

app.post("/books/request", (req, res) => {
  const { book_id, user_id } = req.body;
    console.log(book_id);
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
    res.status(201).json({ message: "Book request created successfully" });
  });
});

app.post("/books/approve", (req, res) => {
        const { requestId } = req.body;
      
        db.query('UPDATE requests SET book_status = "approved" WHERE request_id = ?', [requestId], (err, result) => {
          if (err) {
            console.error("Error approving book request:", err);
            res.status(500).json({ error: "Internal server error" });
            return;
          }
          res.json({ message: "Book request approved successfully" });
        });
      });
      

app.post("/books/reject", (req, res) => {
  const { request_id } = req.body;

  db.query(
    "DELETE FROM requests WHERE request_id = ?", request_id,
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

app.post("/books/return", (req, res) => {
  const { book_id, book_status, return_date } = req.body;

  const returnData = {
    book_status,
    borrower_id: null,
    checkout_date: null,
    return_date,
    next_checkout_date: null,
  };

  db.query(
    "UPDATE books SET ? WHERE book_id = ?",
    [returnData, book_id],
    (err, result) => {
      if (err) {
        console.error("Error updating book status:", err);
        res.status(500).json({ error: "Internal server error" });
        return;
      }
      res.json({ message: "Book returned successfully" });
    }
  );
});

app.get("/users/requests", (req, res) => {
  const userId = req.user.id;

  db.query(
    "SELECT * FROM requests WHERE user_id = ?",
    userId,
    (err, results) => {
      if (err) {
        console.error("Error retrieving user requests:", err);
        res.status(500).json({ error: "Internal server error" });
        return;
      }
      res.json(results);
    }
  );
});

app.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  db.query(
    `SELECT salt, hash, role FROM users WHERE username = ${db.escape(
      username
    )};`,
    async (err, result) => {
      if (err) {
        throw err;
      } else {
        if (result.length === 0) {
          console.log(`Incorrect login attempt for ${username}`);
          return;
        }

        const user = result[0];
        const salt = user.salt;

        const hash = await bcrypt.hash(password, salt);

        if (hash === user.hash) {
          console.log(`${username} logged in!`);
        } else {
          console.log(`Incorrect login attempt for ${username}`);
        }

        //     const isValidPassword = await bcrypt.compare(password, user.hash);

        //     if (isValidPassword) {
        //       console.log(`${username} logged in!`);

        //     } else {
        //       console.log(`Incorrect login attempt for ${username}`);
        //     }
      }
    }
  );
});

app.listen(PORT, (error) => {
  if (!error) {
    console.log(
      "Server is Successfully Running, and App is listening on port: " + PORT
    );
  } else {
    console.log("Error occurred, server can't start", error);
  }
});
