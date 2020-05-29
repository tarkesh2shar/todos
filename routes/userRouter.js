const express = require("express");
const router = express.Router();
const Exceptions = require("../exceptions/exceptions");
const encryptor = require("../helpers/hasher");
const tokenizer = require("../helpers/token");
const pool = require("../services/sqlPool");
const jwt = require("jsonwebtoken");
// create table users (id int AUTO_INCREMENT ,name varchar(20),password varchar(128),email varchar(128), PRIMARY KEY (id));
// insert into users(name,password,email) values ("tarkesh2shar","passwordHere","tarkesh2shar@gmail.com");

router.post("/signup", (req, res) => {
  const { email, password, name } = req.body;

  if (!email) {
    return res.status(Exceptions["EX1"].status).send(Exceptions["EX1"]);
  }
  if (!password) {
    return res.status(Exceptions["EX3"].status).send(Exceptions["EX3"]);
  }
  if (!name) {
    return res.status(Exceptions["EX3"].status).send(Exceptions["EX8"]);
  }
  //check to see if a user with this particular email exists
  pool
    .query(` SELECT * FROM  users WHERE email = '${email}' `)
    .then(async (user) => {
      if (user.length == 0) {
        //no email found // create a user here
        // hashPassword//
        let hashedPassword = await encryptor.hashPassword(password);
        //save in database and generate token and send token
        pool
          .query(
            `insert into users(name,password,email) values ('${name}','${hashedPassword}','${email}'); `
          )
          .then((result) => {
            let userToSend = { email, name, id: result.insertedId };
            let token = tokenizer.generateToken(userToSend);
            console.log(result);
            res.send({
              error: false,
              data: {
                isAuth: true,
                user: userToSend,
                token,
              },
            });
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        return res.status(Exceptions["EX4"].status).send(Exceptions["EX4"]);
      }
    })
    .catch((e) => {
      console.log(e);
    });
});
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(Exceptions["EX1"].status).send(Exceptions["EX1"]);
  }
  if (!password) {
    return res.status(Exceptions["EX3"].status).send(Exceptions["EX3"]);
  }

  try {
    let userArray = await pool.query(
      ` SELECT * FROM  users WHERE email = '${email}' `
    );
    if (userArray.length === 0) {
      return res.status(Exceptions["EX6"].status).send(Exceptions["EX6"]);
    }

    let userInDatabase = userArray[0];
    let isPasswordValid = await encryptor.comparePassword(
      password,
      userInDatabase.password
    );
    if (!isPasswordValid) {
      return res.status(Exceptions["EX7"].status).send(Exceptions["EX7"]);
    }
    // if user is present and has a valid password return a token //
    delete userInDatabase.password;
    let token = tokenizer.generateToken(userInDatabase);
    res.send({
      error: false,
      data: {
        isAuth: true,
        user: userInDatabase,
        token,
      },
    });
  } catch (e) {
    console.log(e);
  }
});

router.get("/currentUser", (req, res) => {
  if (!req.headers.authorization) {
    return res.status(Exceptions["EX9"].status).send({
      error: true,
      data: {
        isAuth: false,
      },
    });
  }
  let token = req.headers.authorization.split(" ")[1];
  let user = jwt.decode(token);

  if (!user) {
    return res.status(Exceptions["EX9"].status).send({
      error: true,
      data: {
        isAuth: false,
      },
    });
  }
  res.send({
    error: false,
    data: {
      isAuth: true,
      user,
      token,
    },
  });
});
router.get("/forgetPassword", (req, res) => {
  res.send({ hello: "there" });
});

module.exports = router;
