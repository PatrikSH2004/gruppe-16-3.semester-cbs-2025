var express = require("express");
var nodemailer = require("nodemailer");
var router = express.Router();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "supersejt.disprojekt.2025@gmail.com",
    pass: "irec tngc kmpn odny",
  },
});

transporter.verify((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Server er klar til at tage imod emails");
  }
});


module.exports = router;