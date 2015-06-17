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


//////////////////////////////////////////////////////////////////////////////////
///////////////////////////////// LOOPS ////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// SendCommand kan een nieuw commando geven op basis van verschillende modellen. Het verbeteren van deze modellen zal mogelijk een belangrijk onderdeel zijn van het succes van de show.
// INPUT: X,Y,Z,R + vX, vY, vZ, vR Drone
// OUTPUT: X, Y, Z, R Drone
var SendCommand = function() {};

// Doel: Veiligheid gehele systeem checken
// Per seconde: 1 ~ 10
// Safety check doet verschillende checks (zoals genoemd in safety measures) indien de situatie als onveilig wordt aangekaart kan besloten worden alle drones te laten laden.
// INPUT: TUTI
// OUTPUT: Veiligheid situatie
var SafetyCheck = function() {}

// UpdateDisplay
// Doel: Stuurt de huidige stand van zaken naar alle clients die aan het luisteren zijn.
// Per seconde: 10 ~ 20
// Door update display blijft iemand die naar de monitor kijkt op de hoogte van wat er gebeurt in de computer. 
var UpdateDisplay = function() {}


// DoFunction handles two important parts of functions. The first
// is how many times a second a function has to run. 
//
// TODO: The second more important fact is that it checks if it has done
// it before it starts the next.
var DoFunction = function(timesPerSecond, functionToDo) {
  setInterval(functionToDo, Math.round(1000 / timesPerSecond));
} 

DoFunction(10, SendCommand);
DoFunction( 1, SafetyCheck);
DoFunction(15, UpdateDisplay);



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
