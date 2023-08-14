const bcrypt = require("bcrypt");
const sgMail = require("@sendgrid/mail");
require("dotenv").config();
const User = require("../models/Users");
const Token = require("../models/Token");
const Verification = require("../models/Verification");
require('dotenv').config();

const frontEndUrl = process.env.FRONTEND_URL;
class UserController {
  static async getAllUsers(req, res) {
    try {
      const users = await User.getAll();
      res.status(200).json(users);
    } catch (error) {
      res.status(404).json({ error: "Unable to fetch users." });
    }
  }

  static async getUserById(req, res) {
    const { id } = req.params;
    try {
      const user = await User.getById(id);
      res.status(200).json(user);
    } catch (error) {
      res.status(404).json({ error: "User not found." });
    }
  }

  static async getUserByUsername(req, res) {
    const { username } = req.body;
    try {
      const user = await User.getByUsername(username);
      res.status(200).json(user);
    } catch (error) {
      console.log(error);
      res.status(404).json({ error: "User not found." });
    }
  }

  static async getUserByEmail(req, res) {
    const { email } = req.body;

    try {
      const user = await User.getByEmail(email);
      res.status(200).json(user);
    } catch (error) {
      console.log(error);
      res.status(404).json({ error: "User not found." });
    }
  }

  static async updateUser(req, res) {
    const { id } = req.params;
    const { firstName, lastName, email, username, password } = req.body;

    try {
      const user = await User.getById(id);
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.email = email || user.email;
      user.username = username || user.username;
      user.password = password || user.password;
      res.status(202).json(user);
    } catch (error) {
      res.status(404).json({ error: "User not found." });
    }
  }

  static async deleteUser(req, res) {
    const { id } = req.params;
    try {
      const user = await User.getById(id);
      await user.delete();
      res.status(204).json({ message: "User deleted successfully." });
    } catch (error) {
      res.status(404).json({ error: "User not found." });
    }
  }

  static async register(req, res) {
    const rounds = parseInt(process.env.BCRYPT_SALT_ROUNDS);
    try {
      const data = req.body;
      
      console.log(req.body);
      const salt = await bcrypt.genSalt(rounds);
      data.password = await bcrypt.hash(data.password, salt);
      const result = await User.create(data);
      const verificationToken = (await Verification.create(result.id)).token;
      const url = `http://localhost:3000/user/checkEmailToken/?token=${verificationToken}`;
      const sgApiKey = process.env.SENDGRID_API_KEY;
      sgMail.setApiKey(sgApiKey);

      await sgMail.send({
        to: result.email,
        from: `Learnt.me <${process.env.SENDER_EMAIL}>`,
        subject: "Verify your email",
        html: `<div style="width: 70%; margin: 0 auto; ">
          <h2>Learnt.me<h2>
          <p>Thanks for signing up for Learnt.me! We're excited to have you as an early user. Just verify your email and start supercharging speech!</p>
          <h6 style="font-size: 18px">Verify your email:</h6>
          <a style="margin-top:1em; padding: 1em; background-color: #33b249; text-decoration: none ; color: white" href="${url}"> <b>Verify Your Email Address</b></a></div>`,
      });
      console.log("run");
      res.status(201).send(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async login(req, res) {
    const data = req.body;
    try {
      const user = await User.getByUsername(data.username);
      const authenticated = await bcrypt.compare(data.password, user.password);
      if (!authenticated) {
        throw new Error("Wrong username or password");
      } else {
        const token = await Token.create(user.id);
        res.status(200).json({ authenticated: true, user, token: token.token });
      }
    } catch (error) {
      res.status(403).json({ error: error.message });
    }
  }

  static async logout(req, res) {
    try {
      const token = req.headers.authorization;

      await Token.deleteByToken(token);

      res.status(200).json({ message: "Logged out successfully." });
    } catch (error) {
      res.status(500).json({ error: "Unable to logout." });
    }
  }

  static async checkEmailToken(req, res) {
    const token = req.query.token;
    try {
      console.log("run");
      const verifiedToken = await Verification.getOneByToken(token);
      await Verification.deleteByToken(verifiedToken.token_id);
      await User.verifyUser(verifiedToken.user_id);
      
      // Redirecting to a frontend success page
      res.redirect(frontEndUrl + 'login');
    } catch (error) {
      // Redirecting to a frontend error page
      res.redirect(frontEndUrl + 'signup');
    }
  }
}

module.exports = UserController;
