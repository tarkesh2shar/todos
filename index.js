require("dotenv").config({});
const express = require("express");
const pool = require("./services/sqlPool");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const app = express();
const PORT = process.env.PORT || 2000;
const userRouter = require("./routes/userRouter");
const todoRouter = require("./routes/todoRoutes");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan("dev"));
const authCheck = require("./middleware/authMiddleware");
//create Tables at startup//
try {
  pool.query(
    "create table if not exists users (id int AUTO_INCREMENT ,name varchar(20),password varchar(128),email varchar(128), PRIMARY KEY (id));"
  );
  pool.query(
    "create table if not exists todos (id int  AUTO_INCREMENT, userId int NOT NULL,status  bool NOT NULL default false  ,title varchar(100) NOT NULL, date TIMESTAMP NOT NULL default CURRENT_TIMESTAMP ,PRIMARY KEY (id));"
  );
} catch (e) {
  console.log(e);
}

app.get("/", (req, res) => {
  res.send({ hello: "there" });
});
app.use("/api/user", userRouter);
app.use("/api/todo", authCheck, todoRouter);

app.listen(PORT, () => {
  console.log("listening to port:", PORT);
});
