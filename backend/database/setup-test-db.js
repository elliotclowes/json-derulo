const fs = require('fs')
const path = require('path');

require("dotenv").config()

const sql = fs.readFileSync(path.join(__dirname, 'database.sql')).toString()

const db = require("./test-db")

db.query(sql)
    .then(data => console.log("Set up for test database complete"))
    .catch(error => console.log(error))
