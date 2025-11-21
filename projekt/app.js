var express = require('express');
var path = require('path');
const session = require('express-session');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const rateLimit = require('express-rate-limit');


const createDatabaseConnection = require('./backend/database/database.js');
const passwordConfig = require('./backend/database/config.js');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(globalLimiter);
app.set('trust proxy', 1); //Det gør at Express kan se rigtige IP-adresser.


app.use(session({
  secret: 'hemmelig-nøgle-som-du-skal-skifte',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,   // 15 minutter
    max: 100,                   // max 100 requests pr. IP
    message: "For mange forespørgsler – prøv igen senere.",
    standardHeaders: true,
    legacyHeaders: false
});


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
    app.use('/customer', customerRouter);
    app.use('/firm', firmRouter);
    app.use('/db', dbRouter);
    app.use("/mail", mailRouter.router);

  } catch (err) {
    console.error(err);
  };
})();




module.exports = app;