'use strict';

// Constants
var CURRENT_BASE_IP = '192.168.255.';

// Drone
var ardrone = require('ar-drone');
var colors   = require('colors')
var qtmrt = require('qualisys-rt');
var API = qtmrt.Api;
var api = new API({ debug: true });

var lstDrone = [];
[999,0,1,2,3,4,5].forEach(function(_id) { 
  lstDrone.push({
    _id: _id,
    _state: {
      inAir: 0,
      camera: 0,
      emergency: 0,
      control: 0,
      autopilot: 1
    },
    _target: {
      altitude: 90,
      direction_empty: { vx: 0, vy: 0, vz: 0, vt: 0 },
      direction_control: { vx: 0, vy: 0, vz: 0, vt: 0 },
      direction_height:  { vx: 0, vy: 0, vz: 0, vt: 0 }
    },
    client: ardrone.createClient({
      ip: (_id === 999 ? '192.168.1.1' : CURRENT_BASE_IP + _id),
      frameRate: 1
      //port: 5555
    })
  })
});

setInterval(function() {
    console.log('yay ---> ')
     console.log(lstDrone[0].client);
}, 3000)







// Web visuals
var express = require('express.io');
var path = require('path');
var app = express().http().io()

// view engine setup
app.engine('html', require('hogan-express'));
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Broadcast all draw clicks.
app.io.route('drawClick', function(req) {
    req.io.broadcast('draw', req.data)
})

// Send client html.
app.get('/draw', function(req, res) {
    res.render('draw', {});
})




app.listen(3000)



// var express = require('express');
// var path = require('path');
// var favicon = require('serve-favicon');
// var logger = require('morgan');
// var cookieParser = require('cookie-parser');
// var bodyParser = require('body-parser');

// var routes = require('./routes/index');
// var users = require('./routes/users');

// var app = express();


// // uncomment after placing your favicon in /public
// //app.use(favicon(__dirname + '/public/favicon.ico'));
// app.use(logger('dev'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(require('less-middleware')(path.join(__dirname, 'public')));
// app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', routes);
// app.use('/users', users);

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// // error handlers

// // development error handler
// // will print stacktrace
// if (app.get('env') === 'development') {
//   app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//       message: err.message,
//       error: err
//     });
//   });
// }

// // production error handler
// // no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//   res.status(err.status || 500);
//   res.render('error', {
//     message: err.message,
//     error: {}
//   });
// });


// module.exports = app;
