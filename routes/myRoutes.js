const express = require('express');
const { jwtDecode } = require('jwt-decode');
const router = express.Router();
const slugify = require('slugify');
const pool = require('../database');
// const { orderSuccessEmail } = require('../emailTemplates/orderTemplate');
// const sendEmail = require('../utils/sendEmail');


//--CLASSES route----
router.post('/newclass', async (req, res) => {
  //const users = req.users.id;
  console.log(req.body);
  const date = new Date();
  const created_at = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}`;

  //const rating = [
    // {
    //   "name": "mafuz",
    //   "star": 4,
    //   "review": "<p>Nice one there!</p>",
    //   "review_date": "2024-1-25"
    // }
  //];

  //const ratings = JSON.stringify(rating);
  const {
    class_name,
    updated_at,
  } = req.body;

  let newProduct = await pool.query(
    'INSERT INTO classes ( class_name, created_at, updated_at) VALUES ($1, $2, $3) RETURNING *',
    [
      class_name,
      created_at,
    updated_at
     
    ]
  );
  const id = newProduct.rows[0].class_id;
  return res.json(id);
});

router.get('/classes', (req, res) => {
  const selectSTMT = `select * from classes ORDER BY created_at DESC`;
 // console.log(res);
  pool.query(selectSTMT, (err, result) => {
    if (!err) {
      res.send(result.rows);
    }
  });
  pool.end;
});

router.get('/classes/count', (req, res) => {

  
  const selectSTMT = `SELECT COUNT(class_id) FROM classes`;
 
  pool.query(selectSTMT, (err, result) => {
    if (!err) {
      res.send(result.rows);
      // console.log(result.rows);
    }
  });
  pool.end;
});

router.get('/class/:id', (req, res) => {
  // console.log(req.params.id);
  
  pool.query(
    `Select * from classes where class_id=${req.params.id}`,
    (err, result) => {
      if (!err) {
        res.send(result.rows);
        //  console.log(result.rows);
      }
    }
  );
  pool.end;
});


//--TEACHER route----
router.post('/newteacher', async (req, res) => {
  //const users = req.users.id;
  console.log(req.body);
  const date = new Date();
  const created_at = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}`;

  //const rating = [
    // {
    //   "name": "mafuz",
    //   "star": 4,
    //   "review": "<p>Nice one there!</p>",
    //   "review_date": "2024-1-25"
    // }
  //];

  //const ratings = JSON.stringify(rating);
  const {
    class_name,
    updated_at,
  } = req.body;

  let newProduct = await pool.query(
    'INSERT INTO teachers ( class_name, created_at, updated_at) VALUES ($1, $2, $3) RETURNING *',
    [
      class_name,
      created_at,
    updated_at
     
    ]
  );
  const id = newProduct.rows[0].class_id;
  return res.json(id);
});

router.get('/teachers', (req, res) => {
  const selectSTMT = `select * from teachers ORDER BY created_at DESC`;
 // console.log(res);
  pool.query(selectSTMT, (err, result) => {
    if (!err) {
      res.send(result.rows);
    }
  });
  pool.end;
});

router.get('/teachers/count', (req, res) => {

  
  const selectSTMT = `SELECT COUNT(teacher_id) FROM teachers`;
 
  pool.query(selectSTMT, (err, result) => {
    if (!err) {
      res.send(result.rows);
      // console.log(result.rows);
    }
  });
  pool.end;
});

router.get('/teacher/:id', (req, res) => {
  // console.log(req.params.id);
  
  pool.query(
    `Select * from teachers where teacher_id=${req.params.id}`,
    (err, result) => {
      if (!err) {
        res.send(result.rows);
         console.log(result.rows);
      }
    }
  );
  pool.end;
});


//--product route----
router.post('/newproduct', async (req, res) => {
  //const users = req.users.id;
  //console.log(req.body);
  const date = new Date();
  const created_at = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}`;

  const rating = [
    // {
    //   "name": "mafuz",
    //   "star": 4,
    //   "review": "<p>Nice one there!</p>",
    //   "review_date": "2024-1-25"
    // }
  ];

  const ratings = JSON.stringify(rating);
  const {
    p_name,
    price,
    images,
    brand,
    category,
    description,
    sku,
    color,
    quantity,
    regular_price,
    sold,
  } = req.body;

  let newProduct = await pool.query(
    'INSERT INTO products ( p_name, price, images, brand, category, description,sku, color, quantity, regular_price, sold, ratings, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *',
    [
      p_name,
      price,
      images,
      brand,
      category,
      description,
      sku,
      color,
      quantity,
      regular_price,
      sold,
      ratings,
      created_at,
    ]
  );
  const id = newProduct.rows[0].product_id;
  return res.json(id);
});



router.get('/products/category', (req, res) => {
  const selectSTMT = `SELECT DISTINCT p.category FROM Products p`;
  pool.query(selectSTMT, (err, result) => {
    if (!err) {
      res.send(result.rows);
    }
  });
  pool.end;
});

router.get('/products/piechart', (req, res) => {
  const selectSTMT = `select sum(quantity), category from products  group by category`;
  pool.query(selectSTMT, (err, result) => {
    if (!err) {
      res.send(result.rows);
    }
  });
  pool.end;
});

router.get('/products/sum', (req, res) => {
  const selectSTMT = `select sum(p.sold*p.price) from products p where updated_at > current_date - interval '1' year`;
  pool.query(selectSTMT, (err, result) => {
    if (!err) {
      res.send(result.rows);
    }
  });
  pool.end;
});

router.get('/products/dailysales', (req, res) => {
  const selectSTMT = `select sum(p.sold*p.price) from products p where updated_at > current_date - interval '1' day`;
  pool.query(selectSTMT, (err, result) => {
    if (!err) {
      res.send(result.rows);
    }
  });
  pool.end;
});

router.get('/products/weeklysales', (req, res) => {
  const selectSTMT = `select sum(p.sold*p.price) from products p where updated_at > current_date - interval '7' day`;
  pool.query(selectSTMT, (err, result) => {
    if (!err) {
      res.send(result.rows);
    }
  });
  pool.end;
});

router.get('/products/monthlysales', (req, res) => {
  const selectSTMT = `select sum(p.sold*p.price) from products p where updated_at > current_date - interval '30' day`;
  pool.query(selectSTMT, (err, result) => {
    if (!err) {
      res.send(result.rows);
    }
  });
  pool.end;
});

router.get('/products/count', (req, res) => {
  const selectSTMT = `SELECT SUM(quantity) FROM Products`;
  pool.query(selectSTMT, (err, result) => {
    if (!err) {
      res.send(result.rows);
    }
  });
  pool.end;
});

router.get('/products', (req, res) => {
  const selectSTMT = `select * from products ORDER BY created_at DESC`;
  pool.query(selectSTMT, (err, result) => {
    if (!err) {
      res.send(result.rows);
    }
  });
  pool.end;
});

router.get('/products/allSales', (req, res) => {
  const selectSTMT = `SELECT sku, p_name, price, sold, sum(sold*price) AS sales, quantity, created_at, updated_at from products GROUP BY sku, p_name, price, sold, quantity, created_at, updated_at ORDER BY sku DESC`;
  pool.query(selectSTMT, (err, result) => {
    if (!err) {
      res.send(result.rows);
    }
  });
  pool.end;
});

router.get('/products/salesByMonths', (req, res) => {
  const selectSTMT = `SELECT DATE_TRUNC('month', updated_at) AS month, sum(sold*price) from products 
  WHERE updated_at IS NOT NULL GROUP BY month ORDER BY month DESC LIMIT 6`;
  pool.query(selectSTMT, (err, result) => {
    if (!err) {
      res.send(result.rows);
    }
  });
  pool.end;
});

router.get('/customer/purchaseByMonths/:id', (req, res) => {
  // console.log(req.params.id);
  const selectSTMT = `SELECT DATE_TRUNC('month', paid_at) AS month, sum(totalprice) from orders 
WHERE users = ${req.params.id} and paid_at IS NOT NULL GROUP BY month ORDER BY month DESC LIMIT 6`;
  pool.query(selectSTMT, (err, result) => {
    if (!err) {
      res.send(result.rows);
    }
  });
  pool.end;
});

router.get('/products/latest', (req, res) => {
  // console.log(res);
  const selectSTMT = `SELECT * FROM products ORDER BY created_at DESC LIMIT 20`;

  pool.query(selectSTMT, (err, result) => {
    if (!err) {
      res.send(result.rows);
    }
  });
  pool.end;
});

router.get('/products/cate', (req, res) => {
  const brand = 'Butter';
  //console.log(res);
  const selectSTMT = `SELECT * FROM products where category = 'Wrist Watch' ORDER BY created_at DESC LIMIT 20`;
  pool.query(selectSTMT, (err, result) => {
    if (!err) {
      res.send(result.rows);
    }
  });
  pool.end;
});

router.get('/products/ai/category/:category', (req, res) => {
  const cat = req.params.category;
  // console.log(cat);
  const selectSTMT = `SELECT * FROM products where category = '${cat}' ORDER BY created_at DESC LIMIT 6`;
  pool.query(selectSTMT, (err, result) => {
    if (!err) {
      res.send(result.rows);
    }
  });
  pool.end;
});

router.get('/product/:id', (req, res) => {
  // console.log(req.params.id);
  //  console.log(res);
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

router.get('/review/:id', (req, res) => {
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

router.put('/productUpdate/:id', (req, res) => {
  const prodt = req.body;

  const imgs = JSON.stringify(prodt?.images);
  const imgs2 = imgs.replace(/\[/g, '{').replace(/\]/g, '}');

  // console.log(imgs.replace(/\[/g, "{").replace(/\]/g, "}"));
  //console.log(imgs[0]);
  let updateQuery = `update products
                       set p_name = '${prodt.p_name}',
                       price = '${prodt.price}',
                        images = '${imgs2}',
                       brand = '${prodt.brand}',
                       description = '${prodt.description}',
                       quantity = '${prodt.quantity}',
                       category = '${prodt.category}',
                       color = '${prodt.color}'
                       where product_id=${req.params.id}`;
  pool.query(updateQuery, (err, result) => {
    if (!err) {
      res.send('Update was successful');
    } else {
      console.log(err.message);
    }
  });
  pool.end;
});

router.put('/stockUpdate', (req, res) => {
  //console.log(req.body);
  const prodt = req.body;
  const date = new Date();
  const updated_at = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}`;
  // console.log(prodt);
  let updateQuery = `update products
                       set quantity =  quantity - '${prodt?.quantity}',
                       sold = sold + '${prodt?.sold}',
                       updated_at = '${updated_at}'
                       where product_id=${prodt?.product_id}`;

  pool.query(updateQuery, (err, result) => {
    if (!err) {
      res.send('Update was successful');
    } else {
      // console.log(err.message);
    }
  });
  pool.end;
});

router.put('/stockUpdate1', (req, res) => {
  const prodt = req.body;
  const date = new Date();
  const updated_at = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}`;
  let updateQuery1 = `update products
                       set quantity =  quantity - '${prodt?.quantity}',
                       sold = sold + '${prodt?.sold}',
                       updated_at = '${updated_at}'
                       where product_id=${prodt?.product_id}`;

  pool.query(updateQuery1, (err, result) => {
    if (!err) {
      res.send('Update was successful');
    } else {
      console.log(err.message);
    }
  });
  pool.end;
});

router.put('/stockUpdate2', (req, res) => {
  const prodt = req.body;
  const date = new Date();
  const updated_at = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}`;
  let updateQuery2 = `update products
                       set quantity =  quantity - '${prodt?.quantity}',
                       sold = sold + '${prodt?.sold}',
                       updated_at = '${updated_at}'
                       where product_id=${prodt?.product_id}`;

  pool.query(updateQuery2, (err, result) => {
    if (!err) {
      res.send('Update was successful');
    } else {
      console.log(err.message);
    }
  });
  pool.end;
});
router.put('/stockUpdate3', (req, res) => {
  const prodt = req.body;
  const date = new Date();
  const updated_at = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}`;
  let updateQuery3 = `update products
                       set quantity =  quantity - '${prodt?.quantity}',
                       sold = sold + '${prodt?.sold}',
                       updated_at = '${updated_at}'
                       where product_id=${prodt?.product_id}`;

  pool.query(updateQuery3, (err, result) => {
    if (!err) {
      res.send('Update was successful');
    } else {
      console.log(err.message);
    }
  });
  pool.end;
});

router.put('/reviews/:id', async (req, res) => {
  const rev = req.body;
  const id = req.params.id;
  // console.log(rev);
  const rev1 = JSON.stringify(rev?.ratings);
  console.log(rev1);
  const review = await pool.query(
    'SELECT ratings FROM products WHERE product_id = $1',
    [id]
  );
  if (review === null) {
    let updateReview = `update products
  SET ratings = '${rev1}'
  where product_id=${req?.params?.id}`;
    pool.query(updateReview, (err, result) => {
      if (!err) {
        res.send('Review added successfully');
      } else {
        console.log(err.message);
      }
    });
    pool.end;
  } else {
    let updateReview1 = `update products
  SET ratings = ratings::jsonb || '${rev1}'
  where product_id=${req?.params?.id}`;
    pool.query(updateReview1, (err, result) => {
      if (!err) {
        res.send('Review added successfully');
      } else {
        console.log(err.message);
      }
    });
    pool.end;
  }
});

router.delete('/product/:id', (req, res) => {
  // console.log(req.params);
  let deleteQuery2 = `delete from products where product_id=${req.params.id}`;
  pool.query(deleteQuery2, (err, result) => {
    if (!err) {
      res.send('Deletion was successful');
    } else {
      console.log(err.message);
    }
  });
  pool.end;
});

router.get('/user/:id', (req, res) => {
  pool.query(`Select * from users where id=${req.params.id}`, (err, result) => {
    if (!err) {
      res.send(result.rows);
    }
  });
  pool.end;
});

router.get('/users', (req, res) => {
  const selectSTMT = `select *  from users ORDER BY created_at DESC`;
  pool.query(selectSTMT, (err, result) => {
    if (!err) {
      res.send(result.rows);
    }
  });
  pool.end;
});

router.get('/users/count', (req, res) => {
  const selectSTMT = `select COUNT(*)  from users`;
  pool.query(selectSTMT, (err, result) => {
    if (!err) {
      res.send(result.rows);
    }
  });
  pool.end;
});

router.put('/user/:id', (req, res) => {
  let user = req.body;

  // console.log(user);
  let updateQuery = `update users
    set username = '${user.username}',
    email = '${user.email}',
    phone = '${user.phone}',
    photo = '${user.photo}',
    address = '${user.address}',
    region = '${user.region}',
    country = '${user.country}'
    where id = ${user.id}`;
  pool.query(updateQuery, (err, result) => {
    if (!err) {
      res.send('Update was successful');
    } else {
      console.log(err.message);
    }
  });
  pool.end;
});

router.post('/user', async (req, res) => {
  const { formData } = req.body;
  const email = formData.receiver;
  //console.log(formData.receiver);

  try {
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(401).send('Verification failed');
    }

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
    });
    // return res.json({ jwtToken });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.put('/cartItem/:id', (req, res) => {
  let user = req.body;
  const use1 = user.cartitems[0];
  const use2 = JSON.stringify(use1);
  const use = `'${use2}'`;
  //console.log(use2);
  //console.log(req.params.id);
  let updateCart = `update users
      set cartitems = '${use2}'
    where id=${req.params.id}`;
  pool.query(updateCart, (err, result) => {
    if (!err) {
      res.send('Cart Added Successful');
    } else {
      console.log(err.message);
    }
  });
  pool.end;
});

router.get('/getCart/:id', (req, res) => {
  pool.query(
    `Select cartItems from users where id=${req.params.id}`,
    (err, result) => {
      if (!err) {
        res.send(result.rows);
      }
    }
  );
  pool.end;
});

router.post('/addUsers', async (req, res) => {
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
pool.end;
//--order route----

router.post('/orders', async (req, res) => {
  // const user = req.users.name;

  // const decoded = req.headers.authorization;
  // const dec = decoded.slice(7);
  // const decode = jwtDecode(dec);
  //console.log(req.params);
  // const user = await pool.query(`SELECT * FROM users WHERE id = ${decode.user.id}`);
  // console.log(user.rows[0].username, user.rows[0].email);

  const date = new Date();
  const created_at = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}`;

  const {
    orderitems,
    shippingaddress,
    paymentmethod,
    paymentresult,
    coupon_name,
    coupon_discount,
    itemsprice,
    shippingprice,
    taxprice,
    totalprice,
    ispaid,
    isdelivered,
    paid_at,
    delivered_at,
    users,
  } = req.body;

  let newOrder = await pool.query(
    'INSERT INTO orders (orderitems, shippingaddress, paymentmethod, paymentresult, coupon_name, coupon_discount, itemsprice, shippingprice, taxprice, totalprice, ispaid, isdelivered, paid_at, delivered_at, users, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *',
    [
      orderitems,
      shippingaddress,
      paymentmethod,
      paymentresult,
      coupon_name,
      coupon_discount,
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
  // const subject = "Mafuzdynamics Order Placed";
  // const send_to = user.rows[0].email;
  // let order = [];
  // order = orderitems;

  // const template = orderSuccessEmail(user.rows[0].username, order);
  // const reply_to = "mmutarum@gmail.com";

  // await sendEmail(subject, send_to, template, reply_to);

  const id = newOrder.rows[0].order_id;

  return res.json(id);
});
pool.end;

router.get('/orders/history/:id', (req, res) => {
  //console.log(req.params.id);
  //const param = toString(req.params.id)
  pool.query(
    `Select * from orders where users=${req.params.id} ORDER BY created_at DESC LIMIT 15 `,
    (err, result) => {
      if (!err) {
        res.send(result.rows);
      }
    }
  );
  pool.end;
});

router.get('/orders/history', (req, res) => {
  //console.log(req.params.id);
  //const param = toString(req.params.id)
  pool.query(`Select * from orders`, (err, result) => {
    if (!err) {
      res.send(result.rows);
    }
  });
  pool.end;
});

router.get('/orders/dashboad/history', (req, res) => {
  //console.log(req.params.id);
  //const param = toString(req.params.id)
  pool.query(`Select * from orders ORDER BY created_at DESC LIMIT 15`, (err, result) => {
    if (!err) {
      res.send(result.rows);
    }
  });
  pool.end;
});

router.get('/order/:id', (req, res) => {
  // console.log(req.params.id);
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

router.get('/orders/sum', (req, res) => {
  const selectSTMT = `SELECT sum(totalprice) from orders WHERE isdelivered = 'false'`;
  pool.query(selectSTMT, (err, result) => {
    if (!err) {
      res.send(result.rows);
    }
  });
  pool.end;
});

router.get('/orders/sales', (req, res) => {
  const selectSTMT = `SELECT sum(totalprice) from orders WHERE ispaid = 'true'`;
  pool.query(selectSTMT, (err, result) => {
    if (!err) {
      res.send(result.rows);
    }
  });
  pool.end;
});

router.put('/orders/payment/:id', (req, res) => {
  let order = req.params;
  const date = new Date();
  const paid_at = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}`;
  //console.log(paid_at);
  let updateQuery = `update orders
  set ispaid = 'true',
  paid_at = '${paid_at}'
  where order_id = ${req.params.id}`;
  pool.query(updateQuery, (err, result) => {
    if (!err) {
      res.send('Update was successful');
    } else {
      console.log(err.message);
    }
  });
  pool.end;
});

router.put('/orders/cash/update/:id', (req, res) => {
  let order = req.body;
  const date = new Date();
  const delivered_at = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}`;
  //  console.log(order);
  let updateQuery = `update orders
    set isdelivered = 'true',
    ispaid = 'true',
    delivered_at = '${delivered_at}',
    paid_at = '${delivered_at}'
    where order_id = ${req.params.id}`;
  pool.query(updateQuery, (err, result) => {
    if (!err) {
      res.send('Update was successful');
    } else {
      console.log(err.message);
    }
  });
  pool.end;
});

router.put('/orders/update/:id', (req, res) => {
  let order = req.params.id;
  const date = new Date();
  const delivered_at = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}`;
  //console.log(order);
  let updateQuery = `update orders
    set isdelivered = 'true',
    
    delivered_at = '${delivered_at}'
   
    where order_id = ${req.params.id}`;
  pool.query(updateQuery, (err, result) => {
    if (!err) {
      res.send('Update was successful');
    } else {
      console.log(err.message);
    }
  });
  pool.end;
});

//--category route----

router.post('/addCategory', async (req, res) => {
  //const users = req.users.id;
  const date = new Date();
  const created_date = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}`;
  const { name, slug, updated_date } = req.body;

  let newCategory = await pool.query(
    'INSERT INTO category ( name, slug, created_date, updated_date) VALUES ($1, $2, $3, $4) RETURNING *',
    [name, slug, created_date, updated_date]
  );
  const id = newCategory.rows[0].category_id;

  return res.json('Saved Successful');
});
pool.end;

router.get('/categories', (req, res) => {
  const selectSTMT = `select * from category`;
  pool.query(selectSTMT, (err, result) => {
    if (!err) {
      res.send(result.rows);
    }
  });
  pool.end;
});

router.get('/categories/count', (req, res) => {
  const selectSTMT = `select COUNT(*) from category`;
  pool.query(selectSTMT, (err, result) => {
    if (!err) {
      res.send(result.rows);
    }
  });
  pool.end;
});

router.delete('/category/:id', (req, res) => {
  //const cat = req.params
  let deleteQuery = `delete from category where category_id=${req.params.id}`;
  pool.query(deleteQuery, (err, result) => {
    if (!err) {
      res.send('Deletion was successful');
    } else {
      console.log(err.message);
    }
  });
  pool.end;
});

//--brnd route----

router.post('/addBrand', async (req, res) => {
  //const users = req.users.id;
  const date = new Date();
  const created_date = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}`;
  const { name, category, slug, updated_date } = req.body;

  let newBrand = await pool.query(
    'INSERT INTO brand ( name, category, slug, created_date, updated_date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [name, category, slug, created_date, updated_date]
  );
  const id = newBrand.rows[0].brand_id;

  return res.json('Saved Successful');
});
pool.end;
router.get('/brands', (req, res) => {
  const selectSTMT = `select * from brand`;
  pool.query(selectSTMT, (err, result) => {
    if (!err) {
      res.send(result.rows);
    }
  });
  pool.end;
});

router.delete('/brand/:id', (req, res) => {
  //const cat = req.params
  let deleteQuery = `delete from brand where brand_id=${req.params.id}`;
  pool.query(deleteQuery, (err, result) => {
    if (!err) {
      res.send('Deletion was successful');
    } else {
      console.log(err.message);
    }
  });
  pool.end;
});

//--coupon route----

router.post('/addCoupon', async (req, res) => {
  //const users = req.users.id;
  const date = new Date();
  const created_date = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}`;
  const { name, discount, expired_at } = req.body;
  let newCoupon = await pool.query(
    'INSERT INTO coupon (name, discount, created_date, expired_at) VALUES ($1, $2, $3, $4) RETURNING *',
    [name, discount, created_date, expired_at]
  );
  const id = newCoupon.rows[0].coupon_id;

  return res.json('Saved Successful');
});
pool.end;

router.get('/coupons', (req, res) => {
  const selectSTMT = `select * from coupon`;
  pool.query(selectSTMT, (err, result) => {
    if (!err) {
      res.send(result.rows);
    }
  });
  pool.end;
});

router.get('/coupon/:couponName', (req, res) => {
  const me = req.params.couponName;
  const myCoupon = "'" + me + "'";
  //console.log(myCoupon);
  const selectSTMT = `select * from coupon where name=${myCoupon}`;
  pool.query(selectSTMT, (err, result) => {
    if (!err) {
      res.send(result.rows);
      console.log(result.rows);
    }
  });
  pool.end;
});
router.delete('/coupon/:id', (req, res) => {
  //const cat = req.params
  let deleteQuery = `delete from coupon where coupon_id=${req.params.id}`;
  pool.query(deleteQuery, (err, result) => {
    if (!err) {
      res.send('Deletion was successful');
    } else {
      console.log(err.message);
    }
  });
  pool.end;
});

// transfare funds

router.post('/fundstransfer', async (req, res) => {
  console.log(req.body);
  const date = new Date();
  const trans_date = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}`;

  const { formData } = req.body;
  const { amount, receiver, sender, description, trans_time, status, user_id } =
    formData;
  // if(!amount || !receiver || !sender){
  //   res.status(400)
  //   throw new Error("Please fill in all the fields")
  // }
  // Verify user available balance before transaction
  const user = await pool.query('SELECT balance FROM users WHERE email = $1', [
    sender,
  ]);

  const { balance } = user?.rows[0];

  if (balance < amount) {
    return res.status(401).send('Insufficient balance');
  }
  pool.end;

  let newTrans = await pool.query(
    'INSERT INTO transactions (amount, receiver, sender, description, status, trans_date, trans_time, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
    [
      amount,
      receiver,
      sender,
      description,
      status,
      trans_date,
      trans_time,
      user_id,
    ]
  );

  return res.json('Saved Successful');
});

pool.end;

router.post('/deposittransfer', async (req, res) => {
  console.log(req.body);
  const date = new Date();
  const trans_date = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}`;

  const { formData } = req.body;
  const { amount, receiver, sender, description, trans_time, status, user_id } =
    formData;
  // if(!amount || !receiver || !sender){
  //   res.status(400)
  //   throw new Error("Please fill in all the fields")
  // }
  // Verify user available balance before transaction
  const user = await pool.query('SELECT balance FROM users WHERE email = $1', [
    receiver,
  ]);

  // const { balance } = user?.rows[0];

  // if (balance < amount) {
  //   return res.status(401).send('Insufficient balance');
  // }
  // pool.end;

  let newTrans = await pool.query(
    'INSERT INTO transactions (amount, receiver, sender, description, status, trans_date, trans_time, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
    [
      amount,
      receiver,
      sender,
      description,
      status,
      trans_date,
      trans_time,
      user_id,
    ]
  );

  let updateQuery = `update users
                       set balance = balance + '${amount}'
                        where email = ${receiver}`;

  pool.query(updateQuery, (err, result) => {});

  return res.json('Saved Successful');
});

pool.end;

router.get('/transactions/:id', (req, res) => {
  //console.log(req.params.id);
  const selectSTMT = `select * from transactions where user_id= ${req.params.id} ORDER BY 
  trans_id DESC`;
  pool.query(selectSTMT, (err, result) => {
    if (!err) {
      res.send(result.rows);
    }
  });
  pool.end;
});

router.put('/receiverUpdate', async (req, res) => {
  const { sender, amount, receiver } = req.body;

  const user = await pool.query(
    'SELECT id, balance FROM users WHERE email = $1',
    [receiver]
  );

  const { id, balance } = user?.rows[0];
  // console.log(balance);
  if (balance < amount) {
    return res.status(401).send('Insufficient balance');
  }

  let updateQuery = `update users
                       set balance = balance + '${amount}'
                        where id = ${id}`;

  pool.query(updateQuery, (err, result) => {
    // if (!err) {
    //   res.send('Update was successful');
    // } else {
    //   console.log(err.message);
    // }
  });
  pool.end;
});

router.put('/senderUpdate', async (req, res) => {
  const { sender, amount, receiver } = req.body;
  const user = await pool.query(
    'SELECT id, balance FROM users WHERE email = $1',
    [sender]
  );

  const { id, balance } = user?.rows[0];

  if (balance < amount) {
    return res.status(401).send('Insufficient balance');
  }
  let updateQuery1 = `update users
  set balance = balance - '${amount}'
  where id=${id}`;

  pool.query(updateQuery1, (err, result) => {
    if (!err) {
      res.send('Update was successful');
    }
  });
  pool.end;
});

module.exports = router;

// let newTransaction = await pool.query(
//   'INSERT INTO products ( user_id, trans_type, prod_purchase_price, prod_purchase_quantity, prod_sales_price, prod_sales_quantity, trans_date, trans_time) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
//   [
//     user_id,
//      trans_type,
//      prod_purchase_price,
//       prod_purchase_quantity,
//        prod_sales_price,
//        prod_sales_quantity,
//        trans_date,
//         trans_time
//   ]
// )
