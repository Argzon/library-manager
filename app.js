var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const Sequelize = require('sequelize');
const Op = Sequelize.Op;
var app = express();

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'library.db'
});

//sync db and authenticate connecton to db
(async () => {
  await sequelize.sync();
  try {
    await sequelize.authenticate();
    console.log("We have a successful connection");
  } catch (error) {
    console.error("Trouble connection to the database: ", error);
  }
})();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error();
  err.status = 404;
  err.message = "Sorry! We couldn't find what you were looking for!";
  res.status(404).render("page-not-found", { error: err });
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//my Global Error Handler
app.use((err, req, res, next) => {
  if (err.status === 404) {
    res.status(404).render("page-not-found", { error: err });
  } else {
    err.message = err.message || "Something failed!!";
    err.status = err.status || 500;
    console.log(err.message, err.status);
    res.status(500).render("error", { error: err });
  }
  console.log(err.message);
});

module.exports = app;
