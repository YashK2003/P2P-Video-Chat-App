require("dotenv").config();

const router = require("express").Router();
const jwt = require("jsonwebtoken");

router.route("/").get((req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    console.log("null if");
    return res.sendStatus(401);
  }
  jwt.verify(token, process.env.SECRET_OR_KEY, (err, user) => {
    if (err) {
      console.log("inside", err);
      return res.sendStatus(403);
    }
    req.user = user;
    res.status(200).send(user);
  });
});

module.exports = router;