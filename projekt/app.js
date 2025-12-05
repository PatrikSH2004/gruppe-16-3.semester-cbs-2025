require('dotenv').config();
var express = require('express');
var path = require('path');
const session = require('express-session');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require("helmet");


const createDatabaseConnection = require('./backend/database/database.js');
const passwordConfig = require('./backend/database/config.js');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
/*
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:"],
      imgSrc: [
        "'self'",
        "data:",
        "blob:",
        "https://res.cloudinary.com",
        "*.cloudinary.com"
      ],
      connectSrc: [
        "'self'",
        "https://res.cloudinary.com",
        "*.cloudinary.com"
      ],
      fontSrc: ["'self'", "https:", "data:"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: []
    },
  })
);*/

app.use((req, res, next) => {
  console.log("CSP:", res.getHeader("Content-Security-Policy"));
  next();
});



app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false,      // skift til true når du kører HTTPS i produktion
    httpOnly: true,     // beskytter mod XSS
    sameSite: 'lax'     // beskytter mod CSRF
  }
}));


const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,   // 15 minutter
    max: 100,                   // max 100 requests pr. IP
    message: "For mange forespørgsler – prøv igen senere.",
    standardHeaders: true,
    legacyHeaders: false
});

app.use(globalLimiter);
app.set('trust proxy', 1); //Det gør at Express kan se rigtige IP-adresser.

const authenticationUser = function(req, res, next) {
  if (req.session.user.id){
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  };
};

const authenticationFirm = function(req, res, next) {
  if (req.session.firmId){
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  };
};

(async () => {
  try {
    const database = await createDatabaseConnection(passwordConfig);
    app.locals.database = database;
    
    var indexRouter = require('./routes/index');
    var customerRouter = require('./routes/customer');
    var firmRouter = require('./routes/firm');
    var dbRouter = require('./routes/dbRoutes');
    var mailRouter = require('./routes/mail');


    const uploadTestRoute = require('./routes/uploadTest');
    app.use("/uploadTest", uploadTestRoute);

    app.use('/', indexRouter);
    app.use('/customer', authenticationUser, customerRouter);
    app.use('/firm', authenticationFirm, firmRouter);
    app.use('/db', dbRouter);
    app.use("/mail", mailRouter.router);

  } catch (err) {
    console.error(err);
  };
})();




module.exports = app;