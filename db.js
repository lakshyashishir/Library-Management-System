require("dotenv").config();
const mysql = require("mysql2");
module.exports = mysql.createConnection({
  host: process.env.MYSQL_HOST || "127.0.0.1",
  user: process.env.mysqlUsername,
  password: process.env.mysqlPassword,
  database: process.env.mysqlDatabase,
  port: process.env.MYSQL_PORT || 3306,
});