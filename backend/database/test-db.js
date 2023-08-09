require("dotenv").config()
const { Pool } = require('pg')


console.log(process.env.TEST_DB_URL)

const test_db = new Pool({
	connectionString: process.env.TEST_DB_URL
})

module.exports = test_db
