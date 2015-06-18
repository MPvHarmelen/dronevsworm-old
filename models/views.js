//////////////////////////////////////////////////////////////////////////////////
///////////////////////////////// VIEWS /////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

var express = require('express.io');
var path = require('path');
var app = express().http().io()
var _   = require('underscore');

// view engine setup
app.engine('html', require('hogan-express'));
app.set('view engine', 'html');
app.set('views', path.join(__dirname, '../views'));
app.use(express.static(path.join(__dirname, '../public')));


// Send client html
var broadcast_last;
app.get('/overview', function(req, res) {

    // console.log(lstDrone[0].client)
    res.render('overview', broadcast_last);
})

// // Broadcast all draw clicks.
// app.io.route('drawClick', function(req) {
//     req.io.broadcast('draw', req.data)
// })
// app.get('/draw', function(req, res) {
//     res.render('draw', {});
// })

app.listen(3000)

module.exports = {

  app: app,

  UpdateDisplay: function(newData) {

  	var broadcast = {
  		lstDrone: []
  	};

  	newData.lstFlock.forEach(function(drone) {

  		var info = {
  			id: drone.id,

  			show: [
  				{ name: 'ip', icon: 'server', title: 'IP', value: drone.client._options.ip },
  				{ name: 'power', icon: 'bolt', title: 'Battery', value: '- %' },
  				{ name: 'target', icon: 'bullseye', title: 'On target', value: '- %' },
  				{ name: 'wind', icon: 'flag', title: 'Wind', value: '- m/s' },
          { name: 'seen', icon: 'eye', title: 'Last seen', value: '- ms' },
          { name: 'xyz', icon: 'codepen', title: 'X,Y,Z', value: [' - ', ' - ' , ' - '] },
  				{ name: 'xyzTarget', icon: 'car', title: 'X,Y,Z Speed', value: [
              Math.round(drone.go.autopilot.vx * 100) / 100, 
              Math.round(drone.go.autopilot.vy * 100) / 100, 
              Math.round(drone.go.autopilot.vz * 100) / 100, 
              Math.round(drone.go.autopilot.vYaw * 100) / 100, 
            ]
          },
          { name: 'xyzControl', icon: 'gamepad', title: 'X,Y,Z Speed', value: [
              Math.round(drone.go.control.vx * 100) / 100, 
              Math.round(drone.go.control.vy * 100) / 100, 
              Math.round(drone.go.control.vz * 100) / 100, 
              Math.round(drone.go.autopilot.vYaw * 100) / 100,
            ]
          },
          { name: 'connect', icon: 'refresh', title: 'Last connect', value: Math.min(new Date().getTime() - drone.navdata.t0.timestamp, 9999) + ' ms' },
  			],

  			state_0: [
  				{ name: 'autopilot', icon: 'car', title: 'Auto pilot', value: '' },
  				{ name: 'takeoff', icon: 'level-up', title: 'Drone fly', value: '' },
  				{ name: 'safety', icon: 'shield', title: 'Safety protocol active', value: '' }
    		],
    		state_1: [
  				{ name: 'control', icon: 'gamepad', title: 'Manual control', value: '' },
  				{ name: 'land', icon: 'level-down', title: 'Drone land', value: '' },
  				{ name: 'stopped', icon: 'stop', title: 'Drone is stopped by safety', value: '' },
  			],
  		}

  		if(drone.navdata.t0.demo) {
        info.show[1].value = drone.navdata.t0.demo.batteryPercentage;
        // console.log(drone.navdata.t0)
  		}
      if(drone.navdata.t0.windSpeed) {
        info.show[3].value = Math.round(drone.navdata.t0.windSpeed.speed, -2) + ' ms';
      }

  		if(drone.state) {

  			info.state_0[0].value = (1 === drone.state.autopilot ? 'success' : 'danger');
  			info.state_0[1].value = (1 === drone.state.inAir ? 'success' : 'danger');
  			info.state_0[2].value = (1 === drone.state.safety ? 'success' : 'danger');

  			info.state_1[0].value = (1 === drone.state.control ? 'success' : 'danger');
  			info.state_1[1].value = (1 !== drone.state.inAir ? 'success' : 'danger');
  			info.state_1[2].value = (1 === drone.state.stopped ? 'success' : 'danger');
  		}

      newData.lstMocap.forEach(function(droneMOCAP) {
        if(droneMOCAP.id == drone.id) {
          var XYZ_found = droneMOCAP.GetLastPoint();
          var XYZ_est = droneMOCAP.GetLastPoint_NotEstimated();

          info.show[4].value = Math.round((XYZ_found.t - XYZ_est.t) / 1000) + ' ms';
          info.show[5].value = [
            Math.round(XYZ_est.p.x),
            Math.round(XYZ_est.p.y),
            Math.round(XYZ_est.p.z),
            ];

        }
      })

  		broadcast.lstDrone.push(info)
  	})

    

  	broadcast_last = broadcast;
    app.io.broadcast('Update_Display', broadcast);
  }
}
