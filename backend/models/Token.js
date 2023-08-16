const { v4: uuidv4 } = require("uuid");
const db = require("../database/db");
require("dotenv").config(); 
class Token {
    constructor({ token_id, user_id, token }) {
        this.token_id = token_id;
        this.user_id = user_id;
        this.token = token;
    }
    static async getAll() {
        const response = await db.query("SELECT * FROM tokens");
        return response.rows.map((row) => new Token(row));
      }
    static async create(user_id) {
        const token = uuidv4();
        const query =
            "INSERT INTO tokens (user_id, token) VALUES ($1, $2) RETURNING token_id, user_id";
        const values = [user_id, token];
        const response = await db.query(query, values);
        const { token_id, user_id: createdUserId } = response.rows[0];
        return new Token({ token_id, user_id: createdUserId, token });
    }
    static async getOneById(token_id) {
        const query = "SELECT * FROM tokens WHERE token_id = $1";
        const response = await db.query(query, [token_id]);
        if (response.rows.length !== 1) {
            throw new Error("Unable to locate token.");
        } else {
            return new Token(response.rows[0]);
        }
    }
    static async getOneByToken(token) {
        // const query = "SELECT * FROM tokens AS t JOIN users as u ON t.user_id = u.user_id WHERE token = $1";
        const query = "SELECT T.token_id, T.token, T.user_id, U.first_name, U.last_name, U.email, U.username, U.teacher FROM tokens AS T INNER JOIN users as U ON T.user_id = U.user_id WHERE token = $1";
        // const query = "SELECT user_id FROM tokens WHERE token = $1"
        const response = await db.query(query, [token]);
        console.log(response.rows)
        if (response.rows.length !== 1) {
            throw new Error("Unable to locate token."); 
            
        } else {
           return (response.rows[0]);
        }
    }
    static async deleteByToken(token) {
        const query = "DELETE FROM tokens WHERE token = $1";
        await db.query(query, [token]);
    }
}
module.exports = Token;
