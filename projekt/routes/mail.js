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

const mailToUser = async (recipients, subjectMsg, textMsg) => {
  const sender = "Understory <supersejt.disprojekt.2025@gmail.com>";
  try {
    const info = await transporter.sendMail({
      from: sender,
      to: recipients,
      subject: subjectMsg,
      text: textMsg,
    });
    console.log("Email sendt afsted: %s", info.messageId);
  } catch (error) {
    console.error(error);
  }
};

/* POST send en mail med nodemailer med JSON data fra request */
router.post("/", async (req, res) => {
  console.log(req.body);
  const { sendTo, sendSubject, sendText } = req.body;
  await mailToUser(sendTo, sendSubject, sendText);
  res.status(201).json({ message: "Email sendt afsted!" });
});

const bookingConfirmationTemplate = (kundeNavn, dato, tid) => `
Kære ${kundeNavn}

Tak for din booking!

Du har booket en tid den ${dato} kl. ${tid}.

Vi glæder os til at se dig!
`;

const rewardReminderTemplate = (kundeNavn, eventNavn, virksomhedNavn, limit, reward, progress) => `
Kære ${kundeNavn}

Håber du har nydt dit ${eventNavn} event hos ${virksomhedNavn}.

Vi skriver for at minde dig om, at du efter ${limit} besøg opnår: ${reward}.

Du har været til ${progress} besøg indtil videre.

Vi håber du nyder dine næste besøg.
`;

module.exports = {
    bookingConfirmationTemplate,
    rewardReminderTemplate,
    mailToUser,
    router
};