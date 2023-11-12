const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../database');
const validInfo = require('../middleware/validInfo');
const jwtGenerator = require('../utils/jwtGenerator');
//const authorize = require("../middleware/authorize");

//authorizeentication

router.post('/register', validInfo, async (req, res) => {
  const {
    username,
    email,
    firstname,
    lastname,
    password,
    roles,
    active,
    phone,
  } = req.body;

  try {
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [
      email,
    ]);

    if (user.rows.length > 0) {
      return res.status(401).json('User already exist!');
    }

    const salt = await bcrypt.genSalt(10);
    const bcryptPassword = await bcrypt.hash(password, salt);

    let newUser = await pool.query(
      'INSERT INTO users (username, email, firstname, lastname, password, roles, active, phone) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [
        username,
        email,
        firstname,
        lastname,
        bcryptPassword,
        roles,
        active,
        phone,
      ]
    );

    const jwtToken = jwtGenerator(newUser.rows[0].id);

    return res.json({ jwtToken });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.post('/login', validInfo, async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    
    if (user.rows.length === 0) {
      return res.status(401).send('Invalid Credential');
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password);

    if (!validPassword) {
      return res.status(401).send('Invalid Credential');
    }
    const jwtToken = jwtGenerator(user.rows[0].id);
    console.log(jwtToken);
    res.send({
      id: user.rows[0].id,
      username: user.rows[0].username,
      email: user.rows[0].email,
      firstname: user.rows[0].firstname,
      lastname: user.rows[0].lastname,
      phone: user.rows[0].phone,
      roles: user.rows[0].roles,
      active: user.rows[0].actve,
      token: jwtToken,
    });
    // return res.json({ jwtToken });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// router.post("/verify", authorize, (req, res) => {
//   try {
//     res.json(true);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// });

module.exports = router;
