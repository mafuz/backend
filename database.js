const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({

  connectionString: process.env.DATABASE_URL,
});

 # database: process.env.DATABASE_NAME,
 # host: process.env.DATABASE_HOST,
#  password: process.env.DATABASE_PASSWORD,
#  user: process.env.DATABASE_USER,
 # port: process.env.DATABASE_PORT,

module.exports = pool;
