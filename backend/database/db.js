require("dotenv").config()
const { Pool } = require('pg')


if (process.env.NODE_ENV == "test") {
    console.log("test DB connection established")
    db = new Pool({
        connectionString: process.env.TEST_DB_URL
    })
} else if (process.env.NODE_ENV == "start") {
    console.log("deployment DB connection established")
    db = new Pool({
        connectionString: process.env.START_DB_URL
    })
} else {
    console.log("DB connection established")
    db = new Pool({
        connectionString: process.env.DB_URL
    })
}



module.exports = db
