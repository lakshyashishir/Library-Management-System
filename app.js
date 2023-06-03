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

function auth(req, res, next) {
  req.role = "user";
  const cookie = req.headers.cookie.slice(10);

  if (req.headers.cookie.includes("sessionId")) {
    db.query(
      `SELECT cookies.userId, users.role FROM cookies INNER JOIN users ON cookies.userId = users.user_id  WHERE sessionid=${db.escape(
        cookie
      )};`,
      (err, results) => {
        if (err) {
          throw err;
        } else {
          if (results.length > 0) {
            const user = results[0];
            req.userID = user.userId;
            req.role = user.role;
            next();
          } else {
            res.status(403).send({ msg: "Not Authenticated" });
          }
        }
      }
    );
  } else {
    res.status(403).send({ msg: "Not Authenticated" });
  }
}

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

app.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

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

app.post("/books", auth, (req, res) => {
  if (req.role !== "admin") {
    res.status(403).send({ msg: "User can not add books" });
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

app.post("/books/request", auth, (req, res) => {
  const { book_id, user_id } = req.body;
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
      'UPDATE books set status = "requested" WHERE book_id = ?',
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

app.post("/books/approve", auth, (req, res) => {
  const { requestId } = req.body;
  if (req.role !== "admin") {
    res.status(403).send({ msg: "User can not approve books" });
    return;
  }

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

app.post("/books/reject", auth, (req, res) => {
  const { requestId } = req.body;
  if (req.role !== "admin") {
    res.status(403).send({ msg: "User can not reject books" });
    return;
  }

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

app.post("/books/return", auth, (req, res) => {
  const { book_id } = req.body;

  db.query(
    "UPDATE books SET status = 'available' WHERE book_id = ?",
    [book_id],
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

app.get("/users/requests", auth, (req, res) => {
  const userId = req.userID;

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

app.listen(PORT, (error) => {
  if (!error) {
    console.log(
      "Server is Successfully Running, and App is listening on port: " + PORT
    );
  } else {
    console.log("Error occurred, server can't start", error);
  }
});
