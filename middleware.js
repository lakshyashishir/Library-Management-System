const db = require("./db");

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

    module.exports = {auth}