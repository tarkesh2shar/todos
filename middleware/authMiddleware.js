const jwt = require("jsonwebtoken");
const Exceptions = require("../exceptions/exceptions");

module.exports = (req, res, next) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    let user = jwt.verify(token, process.env.SUPER_SECRET_JSON_KEY);
    // console.log(user);
    if (!user) {
      return res.status(Exceptions["EX9"].status).send(Exceptions["EX9"]);
    }
    req.currentUser = user;
    next();
  } catch (e) {
    return res.status(Exceptions["EX9"].status).send(Exceptions["EX9"]);
  }
};
