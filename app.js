var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var loudness = require('loudness');
var admin = require('firebase-admin');
var serviceAccount = require('./iotproject-f73dc-firebase-adminsdk-hoqa3-7bba560c4b.json');

var app = express();


// view engine setup
app.engine('html', require('ejs').renderFile);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);

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


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://iotproject-f73dc.firebaseio.com"
});

var db = admin.database();
var beaconRef = db.ref("closest_beacon");
var leftRef = db.ref("left");
var rightRef = db.ref("right");

// Attach an asynchronous callback to read the data at our posts reference
beaconRef.on("value", function(snapshot) {
  loudness.setVolume(45, function(err) {
    
  });
  console.log(snapshot.val());
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});

leftRef.on("value", function(snapshot) {
  console.log(snapshot.val());
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});

rightRef.on("value", function(snapshot) {
  console.log(snapshot.val());
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});


module.exports = app;
