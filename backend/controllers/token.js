const Token = require("../models/Token");
const User = require("../models/Users");

class TokenController {
  static async getOneByToken(req, res) {
    try {
      const { token } = req.body;
      const tokenObj = await Token.getOneByToken(token);
      const user = await User.getById(tokenObj.user_id);
      res.status(200).json(user);
    } catch (error) {
      res.status(404).json({ error: "Token not found." });
    }
  }

  // Create token route is called via the login route in User contolller
  // Delete token route is called via the logout route in User contolller
  // Update token route is not required
}

module.exports = TokenController;
