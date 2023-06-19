const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../db");
const router = express.Router();

router.post("/", async (req, res) => {


  let { username, password, role } = req.body;
  const pass = await hashPassword(password);
  const hash = pass.hash;
  const salt = pass.salt;
  if(adminExist) {
    role = 'admin requested';
  }

  const user = {
    username,
    hash,
    salt,
    role,
  };

  const isUsernameAvailable = await checkUsername(username);

  if (!isUsernameAvailable) {
    res.json({ message: "Username already exists" });
    return;
  }

  db.query("INSERT INTO users SET ?", user, (err, result) => {
    if (err) {
      console.error("Error creating user:", err);
      return;
    }
    // alert("User created successfully");
    res.redirect("/login");
  });
});

async function hashPassword(password) {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(password, salt);

  return {
    salt: salt,
    hash: hash,
  };
}

async function checkUsername(username) {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM users WHERE username = ?",
      [username],
      (err, result) => {
        if (err) {
          console.error("Error checking username:", err);
          reject(err);
          return;
        }

        if (result.length > 0) {
          resolve(false);
        } else {
          resolve(true);
        }
      }
    );
  });
}

async function adminExist() {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM users WHERE role = 'admin'", (err, result) => {
      if (err) {
        console.error("Error checking admin:", err);
        reject(err);
        return;
      }

      if (result.length > 0) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}


module.exports = router;
