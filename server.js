const express = require('express');
const nodemailer = require("nodemailer");
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

// app.use(express.static(path.join(__dirname, '/public')));
app.use(express.json());

//req.body

app.use(cors({
  origin: ["http://localhost:3000",
   "http://localhost:4000", 
   "https://backend-5fjm.onrender.com", 
   "https://shop-npwe.onrender.com"],
  credentials: true,
}));


function sendEmail({ recipient_email, OTP }) {
  return new Promise((resolve, reject) => {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_PASSWORD,
      },
    });

    const mail_configs = {
      from: process.env.MY_EMAIL,
      to: recipient_email,
      subject: "MAFUZDYNAMICS PASSWORD RECOVERY",
      html: `<!DOCTYPE html>
<html lang="en" >
<head>
  <meta charset="UTF-8">
  <title>CodePen - OTP Email Template</title>
  

</head>
<body>
<!-- partial:index.partial.html -->
<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
  <div style="margin:50px auto;width:70%;padding:20px 0">
    <div style="border-bottom:1px solid #eee">
      <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">MAFUZDYNAMICS</a>
    </div>
    <p style="font-size:1.1em">Hi,</p>
    <p>Thank you for choosing Mafuzdynamics. Use the following OTP to complete your Password Recovery Procedure. OTP is valid for 5 minutes</p>
    <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${OTP}</h2>
    <p style="font-size:0.9em;">Regards,<br />Mafuzdynamics</p>
    <hr style="border:none;border-top:1px solid #eee" />
    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
      <p>Koding 101 Inc</p>
      <p>1600 Amphitheatre Parkway</p>
      <p>California</p>
    </div>
  </div>
</div>
<!-- partial -->
  
</body>

</html>`,
    };
    transporter.sendMail(mail_configs, function (error, info) {
      if (error) {
        console.log(error);
        return reject({ message: `An error has occured` });
      }
      return resolve({ message: "Email sent succesfuly" });
    });
  });
}

app.get("/", (req, res) => {
  res.send("Home Page");
});


app.post("/send_recovery_email", async(req, res) => {    
    const { OTP, recipient_email } = req.body
    console.log(OTP, recipient_email)
  try {
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [
    recipient_email,
    ]);
    if (user.rows.length === 0) {
      return res.status(401).send('Verification failed');
    }
    sendEmail(req.body)
    .then((response) =>  res.send({
        id: user.rows[0].id,
        otp: OTP,
        email: recipient_email,
    })).catch((error) => res.status(500).send(error.message));
} catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.use('/api', require('./routes/myRoutes'));

app.use('/authentication', require('./routes/jwtAuth'));

app.listen(PORT, () => console.log(`Server on localhost:${PORT}`));






