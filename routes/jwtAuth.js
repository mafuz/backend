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
    photo,
    address,
    region,
    country,
  } = req.body;

  try {
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [
      email,
    ]);

    if (user.rows.length > 0) {
      return res.status(401).json('User already exist!');
    }
    const role = 'Customer';
    const image =
      'https://res.cloudinary.com/mafuz-enterprise/image/upload/v1700665682/image_t0m6d0.jpg';
    const salt = await bcrypt.genSalt(10);
    const bcryptPassword = await bcrypt.hash(password, salt);
    const date = new Date();
    const create_at = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}`;

    let newUser = await pool.query(
      'INSERT INTO users (username, email, firstname, lastname, password, roles, active, phone, photo, address, region, country, create_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *',
      [
        username,
        email,
        firstname,
        lastname,
        bcryptPassword,
        role,
        active,
        phone,
        image,
        address,
        region,
        country,
        create_at,
      ]
    );

    const jwtToken = jwtGenerator(newUser.rows[0].id);

    return res.json({ jwtToken });
  } catch (err) {
    // console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.post('/login', validInfo, async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(401).send('Invalid Credential');
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password);

    if (!validPassword) {
      return res.status(401).send('Invalid Credential');
    }
    const jwtToken = jwtGenerator(user.rows[0].id);
    // console.log(jwtToken);
    res.send({
      id: user.rows[0].id,
      username: user.rows[0].username,
      email: user.rows[0].email,
      firstname: user.rows[0].firstname,
      lastname: user.rows[0].lastname,
      phone: user.rows[0].phone,
      photo: user.rows[0].photo,
      roles: user.rows[0].roles,
      active: user.rows[0].actve,
      address: user.rows[0].address,
      region: user.rows[0].region,
      country: user.rows[0].country,
      balance: user.rows[0].balance,
      token: jwtToken,
    });
    // return res.json({ jwtToken });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.put('/user/resetpassword', async (req, res) => {
  // console.log(req.body);
  const { id, email, password } = req.body;
  const salt = await bcrypt.genSalt(10);
  const bcryptPassword = await bcrypt.hash(password, salt);

  // console.log(bcryptPassword);

  let updateQuery = `update users
    set password = '${bcryptPassword}'
     where id=${id}`;
  pool.query(updateQuery, (err, result) => {
    if (!err) {
      res.send('Update was successful');
    } else {
      console.log(err.message);
    }
  });
  pool.end;
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
