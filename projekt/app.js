var express = require('express');
var path = require('path');
const session = require('express-session');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var indexRouter = require('./routes/index');
var customerRouter = require('./routes/customer');
var firmRouter = require('./routes/firm');
var dbRouter = require('./routes/dbRoutes');

var app = express();

app.use(session({
  secret: 'hemmelig-nøgle-som-du-skal-skifte', // brug en stærk nøgle i produktion
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // sæt til true hvis du bruger HTTPS
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/customer', customerRouter);
app.use('/firm', firmRouter);
app.use('/db', dbRouter);

module.exports = app;
