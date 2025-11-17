var express = require('express');
var path = require('path');
const session = require('express-session');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const createDatabaseConnection = require('./backend/database/database.js');
const passwordConfig = require('./backend/database/config.js');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'hemmelig-nøgle-som-du-skal-skifte',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

(async () => {
  try {
    const database = await createDatabaseConnection(passwordConfig);
    app.locals.database = database;
    
    var indexRouter = require('./routes/index');
    var customerRouter = require('./routes/customer');
    var firmRouter = require('./routes/firm');
    var dbRouter = require('./routes/dbRoutes');

    app.use('/', indexRouter);
    app.use('/customer', customerRouter);
    app.use('/firm', firmRouter);
    app.use('/db', dbRouter);

  } catch (err) {
    console.error(err);
  };
})();

const uploadTestRoute = require('./routes/uploadTest.js');
app.use("/uploadTest", uploadTestRoute);


module.exports = app;