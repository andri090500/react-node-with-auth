const express = require("express");
const cors = require("cors");
const db = require("./database.js");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const app = express();
const saltRounds = 10;
const PORT = 3001;

app.use(express.json()); // buat ambil data dari client dan di parse ke json
app.use(
  // buat izin spesifik
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
// buat cookie
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    key: "userId",
    secret: "subscribe",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 60 * 60 * 24,
    },
  })
);

// register
app.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // encrypte password
  bcrypt.hash(password, saltRounds, (error, hash) => {
    if (error) return console.log(error);
    let sql = `INSERT INTO user(username,password) VALUES('${username}','${hash}')`;
    db.query(sql, (err, result) => {
      if (err) return console.log("data failed to inserting");
      console.log("data successful inserting");
      const response = JSON.parse(JSON.stringify(result));
      res.send(response);
    });
  });
});
// login
app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  let sql = `SELECT * FROM user WHERE username = '${username}'`;
  db.query(sql, (err, result) => {
    if (err) {
      res.send({ err: err });
    }
    // cek username
    if (result.length > 0) {
      // cek password
      bcrypt.compare(password, result[0].password, (error, response) => {
        if (response) {
          req.session.user = result;
          console.log(result);
          res.send(result);
        } else {
          res.send({ message: "password is wrong" });
        }
      });
    } else {
      res.send({ message: "user doesn't exist" });
    }
  });
});

app.get("/login", (req, res) => {
  if (req.session.user) {
    res.send({ loggedIn: true, user: req.session.user });
  } else {
    res.send({ loggedIn: false });
  }
});

app.listen(PORT, () => console.log("Server is Running at port 3001"));
