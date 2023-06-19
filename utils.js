const db = require("./db");

async function getUsernamefromUserID(user_id) {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT username FROM users WHERE user_id = ?",
      [user_id],
      (err, results) => {
        if (err) {
          reject(err);
          return;
        }
        const username = results[0].username;
        resolve(username);
      }
    );
  });
}

async function getBookTitlefromBookID(book_id) {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT title FROM books WHERE book_id = ?",
      [book_id],
      (err, results) => {
        if (err) {
          reject(err);
          return;
        }
        const book_title = results[0].title;
        resolve(book_title);
      }
    );
  });
}

async function getBookStatusfromBookID(book_id) {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT status FROM books WHERE book_id = ?",
      [book_id],
      (err, results) => {
        if (err) {
          reject(err);
          return;
        }
        const book_status = results[0].status;
        resolve(book_status);
      }
    );
  });
}


module.exports = {
  getUsernamefromUserID,
  getBookTitlefromBookID,
  getBookStatusfromBookID
};
