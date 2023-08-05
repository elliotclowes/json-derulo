const Token = require("../models/Token");

async function authenticator(req, res, next) {
  try {
    const userToken = req.headers["authorization"];
    console.log(userToken);
    if (!userToken) {
      throw new Error("User not authenticated");
    } else {
      const validToken = await Token.getOneByToken(userToken);

      req.user = validToken.user_id;
      next();
    }
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
}

module.exports = authenticator;
