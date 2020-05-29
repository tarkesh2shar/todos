const jwt = require("jsonwebtoken");
const Exceptions = require("../exceptions/exceptions");

module.exports = (req, res, next) => {
  let token = req.headers.authorization.split(" ")[1];
  let user = jwt.decode(token);
  // console.log(user);
  if (!user) {
    return res.status(Exceptions["EX9"].status).send(Exceptions["EX9"]);
  }
  req.currentUser = user;
  next();
};
