const Token = require("../models/Token");
const User = require("../models/Users");

class TokenController {
  static async getAllToken(req, res) {
    try {
      const users = await Token.getAll();
      res.status(200).json(users);
    } catch (error) {
      res.status(404).json({ error: "Unable to fetch all tokens." });
    }
  }

  static async getTokenById(req, res) {
    const { id } = req.params;
    try {
      const user = await Token.getOneById(id);
      res.status(200).json(user);
    } catch (error) {
      res.status(404).json({ error: "Token not found." });
    }
  }
 
    static async getOneByToken(req, res) {
      try {
        const token = req.params.token; // Access the token from the URL parameter
        const tokenObj = await Token.getOneByToken(token);
        res.status(200).json(tokenObj);
      } catch (error) {
        res.status(404).json({ error: "Get by token not found." });
      }
    }
  
  // Create token route is called via the login route in User contolller
  // Delete token route is called via the logout route in User contolller
  // Update token route is not required
}

module.exports = TokenController;
