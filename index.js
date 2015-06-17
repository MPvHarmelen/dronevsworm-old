'use strict';

// Constants
var CURRENT_BASE_IP = '192.168.255.';
var CONTROL_UP_SPEED = 2000;

// Globals

//////////////////////////////////////////////////////////////////////////////////
///////////////////////////////// DRONE //////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

var drone = require('./models/drone.js');

drone.init([999,0,1,2,3,4], '192.168.1.');

//////////////////////////////////////////////////////////////////////////////////
///////////////////////////////// MOCAP //////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

var mocap = require('./models/mocap.js');

// mocap.start('22223', '192.168.1.238');

//////////////////////////////////////////////////////////////////////////////////
///////////////////////////////// VIEWS /////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

var web = require('./models/views.js');






// var express = require('express');
// var path = require('path');
// var favicon = require('serve-f avicon');
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
