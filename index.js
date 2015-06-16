'use strict';

// Constants
var CURRENT_BASE_IP = '192.168.255.';

//////////////////////////////////////////////////////////////////////////////////
///////////////////////////////// DRONE //////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
var ardrone = require('ar-drone');

var lstDrone = [];
[999,0,1,2,3,4].forEach(function(_id) { 
  lstDrone.push({
    id: _id,
    state: {
      inAir: 0,
      camera: 0,
      emergency: 0,
      control: 0,
      autopilot: 1
    },

    // The location object holds the information received from the camera's for each drone
    //  - T0 is the last point
    //  - T1 is the point before that one
    //  - TX contains a array with all points
    location: { 
      t0: { x: 0, y: 0, z: 0, r: 0 },
      t1: { x: 0, y: 0, z: 0, r: 0 },
      tX: []
    },
    // target: {
    //   altitude: 90,
    //   direction_empty: { vx: 0, vy: 0, vz: 0, vt: 0 },
    //   direction_control: { vx: 0, vy: 0, vz: 0, vt: 0 },
    //   direction_height:  { vx: 0, vy: 0, vz: 0, vt: 0 }
    // },
    client: ardrone.createClient({
      ip: (_id === 999 ? '192.168.1.1' : CURRENT_BASE_IP + _id),
      frameRate: 1
      //port: 5555
    })
  })
});

// Used to view the CLIENT object of the drone
// setInterval(function() {
//     console.log('yay ---> ')
//      console.log(lstDrone[0].client);
// }, 3000)

//////////////////////////////////////////////////////////////////////////////////
///////////////////////////////// MOCAP //////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
var colors   = require('colors')
var qtmrt = require('qualisys-rt');
var API = qtmrt.Api;
var api = new API({ debug: true });

api.on('frame', function(data) {
  console.log('Received frame:'.green);
  console.log(data);
});

api.on('end', function(data) { console.log('No more data!'.red); }); //api.disconnect();
api.on('event', function(event) { console.log(event.name.yellow); });
api.on('disconnect', function(event) { process.exit(); });

api.connect() 
  .then(function() { return api.qtmVersion(); })
  .then(function(version) { return api.byteOrder(); })
  .then(function(byteOrder) { return api.getState(); })
  .then(function() { return api.discover(); })

  //.then(function() { return api.getParameters('All'); })
  //.then(function(parameters) {
    //console.log(parameters.the6d);
    //console.log(parameters.the3d);
  //})
  //.then(function() { return api.streamFrames() })
  //.then(function() { return api.streamFrames({ components: ['All'], frequency: 1/100 }) })
  //.then(function() { return api.stopStreaming() })
  //.then(function() { return api.streamFrames({ components: ['All'], frequency: 1/10 }) })
  //.then(function() { return api.streamFrames({ components: ['All'], frequency: 'AllFrames' }) })
  //.then(function() { return api.streamFrames({ components: ['2D'], frequency: '2' }) })
  //.then(function() { return api.streamFrames({ components: ['Image'], frequency: '2' }) })
  //.then(function() { return api.streamFrames({ components: ['3D'], frequency: 1/50 }) })
  //.then(function() { return api.streamFrames({ components: ['3D'] }) })
  //.then(function() { return api.streamFrames({ components: ['Force', 'Image', 'Analog', 'AnalogSingle', '6D', '3D', '2D'], frequency: 'AllFrames' }) })
  //.then(function() { return api.streamFrames({ frequency: 100, components: ['3DNoLabels'] }); })
  //.then(function() { return api.streamFrames({ frequency: 1/100, components: ['3DRes'] }); })
  //.then(function() { return api.streamFrames({ frequency: 1/100, components: ['3DNoLabelsRes'] }); })
  .then(function() { return api.streamFrames({ frequency: 1/100, components: ['6D'] }); })
  //.then(function() { return api.streamFrames({ frequency: 1/100, components: ['6DRes'] }); })
  //.then(function() { return api.streamFrames({ frequency: 1/100, components: ['6DEuler'] }); })
  //.then(function() { return api.streamFrames({ frequency: 1/100, components: ['6DEulerRes'] }); })
  //.then(function() { return api.streamFrames({ frequency: 1/100, components: ['Force'] }); })
  //.then(function() { return api.streamFrames({ frequency: 1/100, components: ['ForceSingle'] }); })
  //.then(function() { return api.streamFrames({ frequency: 1/100, components: ['Image'] }); })
  //.then(function() { return api.streamFrames({ frequency: 1/200, components: ['GazeVector'] }); })
  //.then(function() { return api.disconnect(); })

  .catch(function(err) {
    console.log(err);
  })
;


//////////////////////////////////////////////////////////////////////////////////
///////////////////////////////// WEB VISUALS ////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
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
app.get('/overview', function(req, res) {
    res.render('overview', {
      lstDrone: lstDrone
    });
})

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
