const express = require('express');
const cors = require('cors');
const pool = require('./database');
const bcrypt = require('bcrypt');
const fetchUser = require('./middleware/fetchUser');
const validInfo = require('./middleware/validInfo');
const jwtGenerator = require('./utils/jwtGenerator');
const path = require('path');
const PORT = process.env.PORT || 4000;
//const session = require('express-session');
require('dotenv').config();
//const userRouter = require('./routes/userRouter');

const salt = 10;

//middleware
const app = express();

app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// app.use(express.static(path.join(__dirname, '/public')));

app.use(express.json());

//req.body

app.use(cors());

app.post('/newproduct', async (req, res) => {
  //const users = req.users.id;
  console.log(req.body);
  const { title, price, image, images, brand, description } = req.body;

  let newProduct = await pool.query(
    'INSERT INTO products ( title, price, image, images, brand,  description) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [title, price, image, images, brand, description]
  );
  const id = newProduct.rows[0].product_id;

  return res.json(id);
});

app.get('/products/category', (req, res) => {
  const selectSTMT = `SELECT DISTINCT p.category FROM Products p`;
  pool.query(selectSTMT, (err, result) => {
    if (!err) {
      res.send(result.rows);
    }
  });
  pool.end;
});

app.get('/product', (req, res) => {
  const selectSTMT = `select * from products`;
  pool.query(selectSTMT, (err, result) => {
    if (!err) {
      res.send(result.rows);
    }
  });
  pool.end;
});
// const PAGE_SIZE = 3;
// app.get('/search', async(req, res) => {
//  // const selectSTMT = `select * from products`;
//   const { query } = req;
//     const pageSize = query.pageSize || PAGE_SIZE;
//     const page = query.page || 1;
//     const category = query.category || '';
//     const price = query.price || '';
//     const rating = query.rating || '';
//     const order = query.order || '';
//     const searchQuery = query.query || '';

//     const queryFilter =
//       searchQuery && searchQuery !== 'all'
//         ? {
//             name: {
//               $regex: searchQuery,
//               $options: 'i',
//             },
//           }
//         : {};
//     const categoryFilter = category && category !== 'all' ? { category } : {};
//     const ratingFilter =
//       rating && rating !== 'all'
//         ? {
//             rating: {
//               $gte: Number(rating),
//             },
//           }
//         : {};
//     const priceFilter =
//       price && price !== 'all'
//         ? {
//             // 1-50
//             price: {
//               $gte: Number(price.split('-')[0]),
//               $lte: Number(price.split('-')[1]),
//             },
//           }
//         : {};
//     const sortOrder =
//       order === 'featured'
//         ? { featured: -1 }
//         : order === 'lowest'
//         ? { price: 1 }
//         : order === 'highest'
//         ? { price: -1 }
//         : order === 'toprated'
//         ? { rating: -1 }
//         : order === 'newest'
//         ? { created_at: -1 }
//         : { product_id: -1 };

//     const products = await products.find({
//       ...queryFilter,
//       ...categoryFilter,
//       ...priceFilter,
//       ...ratingFilter,
//     })
//       .sort(sortOrder)
//       .skip(pageSize * (page - 1))
//       .limit(pageSize);

//     const countProducts = await Product.countDocuments({
//       ...queryFilter,
//       ...categoryFilter,
//       ...priceFilter,
//       ...ratingFilter,
//     });
//     res.send({
//       products,
//       countProducts,
//       page,
//       pages: Math.ceil(countProducts / pageSize),
//     });
//   pool.query(selectSTMT, (err, result) => {
//     if (!err) {
//       res.send(result.rows);
//     }
//   });
//   pool.end;
// });

app.get('/product/:id', (req, res) => {
  pool.query(
    `Select * from products where product_id=${req.params.id}`,
    (err, result) => {
      if (!err) {
        res.send(result.rows);
      }
    }
  );
  pool.end;
});

app.get('/review/:id', (req, res) => {
  pool.query(
    `Select * from reviews where id=${req.params.id}`,
    (err, result) => {
      if (!err) {
        res.send(result.rows);
      }
    }
  );
  pool.end;
});

app.put('/product/:id', (req, res) => {
  let product = req.body;
  let updateQuery = `update products
                     set name = '${product.firstname}',
                     surname = '${product.surname}',
                     phone = '${product.phone}',
                     email = '${product.email}',
                     country = '${product.country}',
                     city = '${product.city}',
                     location = '${product.location}'
                     where id = ${product.id}`;

  pool.query(updateQuery, (err, result) => {
    if (!err) {
      res.send('Update was successful');
    } else {
      console.log(err.message);
    }
  });
  pool.end;
});

app.delete('/product/:id', (req, res) => {
  let insertQuery = `delete from users where id=${req.params.id}`;

  pool.query(insertQuery, (err, result) => {
    if (!err) {
      res.send('Deletion was successful');
    } else {
      console.log(err.message);
    }
  });
  pool.end;
});

app.post('/addUsers', async (req, res) => {
  const username = req.body['username'];
  const email = req.body['email'];
  const firstname = req.body['firstname'];
  const lastname = req.body['lastname'];
  const password = req.body['password'];
  const roles = req.body['roles'];
  const active = req.body['active'];
  const phone = req.body['phone'];
  //const usertype = req.body['usertype'];
  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(req.body.password, salt);

  const insertSTMT = `INSERT INTO users (username, email, firstname, lastname, password, roles, active, phone) VALUES ('${username}', '${email}', '${firstname}', '${lastname}', '${passwordHash}', '${roles}', '${active}', '${phone}');`;
  pool
    .query(insertSTMT)
    .then((response) => {
      console.log('Data saved');
      console.log(response);
    })
    .catch((err) => {
      console.log(err);
    });
  console.log();
  res.send('respond received: ' + req.body);
});

app.post('/orders', async (req, res) => {
  //const users = req.users.id;
  //console.log(users);
  const {
    orderitems,
    shippingaddress,
    paymentmethod,
    paymentresult,
    itemsprice,
    shippingprice,
    taxprice,
    totalprice,
    ispaid,
    isdelivered,
    paid_at,
    delivered_at,
    users,
    created_at,
  } = req.body;

  let newOrder = await pool.query(
    'INSERT INTO orders (orderitems, shippingaddress, paymentmethod, paymentresult, itemsprice, shippingprice, taxprice, totalprice, ispaid, isdelivered, paid_at, delivered_at, users, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *',
    [
      orderitems,
      shippingaddress,
      paymentmethod,
      paymentresult,
      itemsprice,
      shippingprice,
      taxprice,
      totalprice,
      ispaid,
      isdelivered,
      paid_at,
      delivered_at,
      users,
      created_at,
    ]
  );
  const id = newOrder.rows[0].order_id;

  return res.json(id);
});

app.get('/orders/history', (req, res) => {
  pool.query(`Select * from orders`, (err, result) => {
    if (!err) {
      res.send(result.rows);
    }
  });
  pool.end;
});

app.get('/order/:id', (req, res) => {
  pool.query(
    `Select * from orders where order_id=${req.params.id}`,
    (err, result) => {
      if (!err) {
        res.send(result.rows);
      }
    }
  );
  pool.end;
});

app.put('/orders/update/:id', (req, res) => {
  let order = req.body;
  console.log(order);
  let updateQuery = `update orders
  set isdelivered = '${order.isdelivered}',
  ispaid = '${order.ispaid}',
  delivered_at = '${order.delivered_at}',
  paid_at = '${order.paid_at}'
  where order_id = ${order.order_id}`;
  pool.query(updateQuery, (err, result) => {
    if (!err) {
      res.send('Update was successful');
    } else {
      console.log(err.message);
    }
  });
  pool.end;
});

// app.post('/login', async (req, res) => {
//   //validateForm(req, res);

//   const potentialLogin = await pool.query(
//     'SELECT id, username, password FROM users u WHERE u.username=$1',
//     [req.body.username]
//   );

//   if (potentialLogin.rowCount > 0) {
//     const isSamePass = await bcrypt.compare(
//       req.body.password,
//       potentialLogin.rows[0].password
//     );
//     const pool = require('./database');
//     if (isSamePass) {
//       //  req.session.user = {
//       //    username: req.body.username,
//       //    id: potentialLogin.rows[0].id,
//       //  };
//       res.json({ loggedIn: true, username: req.body.username });
//     } else {
//       res.json({ loggedIn: false, status: 'Wrong username or password!' });
//       console.log('not good');
//     }
//   } else {
//     console.log('not good');
//     res.json({ loggedIn: false, status: 'Wrong username or password!' });
//   }
// });

//routes

app.use('/authentication', require('./routes/jwtAuth'));

app.listen(PORT, () => console.log(`Server on localhost:${PORT}`));
