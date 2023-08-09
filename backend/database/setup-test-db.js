const fs = require('fs')
const path = require('path');
const db = require("./test-db")

require("dotenv").config()

const sql = fs.readFileSync(path.join(__dirname, 'database.sql')).toString()

function setupTestDb() {
  return db.query(sql)
    .then(data => console.log("Set up for test database complete"))
    .catch(error => console.log(error))
}

module.exports = setupTestDb;
