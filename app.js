var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var bootstrap = require('express-bootstrap-service');
var expressValidator = require('express-validator');

var index = require('./routes/index');
var users = require('./routes/users');
var patientreg = require('./routes/patientreg');
var patientRouter = require('./routes/patients');

var Patients = require('./models/patients')

const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var app = express();


var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var url = 'mongodb://localhost:27017/test';

var connect = mongoose.connect(url, {

});

connect.then((db) => {
  console.log('Connect Successful')
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressValidator())

app.use('/', index);
app.use('/users', users);
app.use('/registration', patientreg)
app.use('/patients', patientRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

module.exports = app;
