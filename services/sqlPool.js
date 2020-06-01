const mysql = require("mysql");
const util = require("util");

// require("dotenv").config({});
const pool = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  port: process.env.MYSQLPORT,
  password: process.env.MYSQLPASSWORD,
  database: process.env.DATABASE_NAME,
});

pool.getConnection((err, connection) => {
  if (err) {
    console.log("Something went wrong while connecting to the database");
  }
  if (connection) connection.release();
  return;
});
pool.query = util.promisify(pool.query);
module.exports = pool;
