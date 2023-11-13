const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  database: process.env.DATABASE_NAME,
  host: process.env.DATABASE_HOST,
  password: process.env.DATABASE_PASSWORD,
  user: process.env.DATABASE_USER,
  port: process.env.DATABASE_PORT,
  connectionString: process.env.DATABASE_URL,
});

// const pool = new Pool({
//   user: 'postgres',
//   password: 'mafuz1234',
//   host: 'localhost',
//   port: 5432,
//   database: 'shop',
// });

// const createTb1Qry = `CREATE TABLE customers (
//     user_id serial PRIMARY KEY,
//     name VARCHAR (100) NOT NULL,
//     surname VARCHAR (100),
//     phone NUMERIC,
//     email VARCHAR (50),
//     country VARCHAR (100),
//     city VARCHAR (100),
//     location VARCHAR (100)
// )`;

// pool
//   .query(createTb1Qry)
//   .then((response) => {
//     console.log('Table created');
//     console.log(response);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

module.exports = pool;
