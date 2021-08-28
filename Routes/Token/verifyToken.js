const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("auth-token");
  if (!token) return res.status(401).send("Acess Denied");

  try {
    const verifiedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verifiedToken;
    next();
  } catch (error) {
    res.status(400).send("Invalid Token");
  }
};
