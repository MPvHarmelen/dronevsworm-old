//////////////////////////////////////////////////////////////////////////////////
///////////////////////////////// DRONE //////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
var ardrone = require('ar-drone');


// Max vertical speed in MM/s
var CONTROL_Z_SPEED = 2000;
var CONTROL_MAX_HEIGHT = 5000;
var CONTROL_MIN_HEIGHT = 50;


var Drone = function(_id, base_ip) {
  this.id = _id;
  this.state = {
    inAir: 0,
    camera: 0,
    emergency: 0,
    control: 0,
    autopilot: 1
  };

  // The location object holds the information received from the camera's for each drone
  //  - T0 is the last point
  //  - T1 is the point before that one
  //  - TX contains a array with all points
  this.location = { 
    t0: { x: 0, y: 0, z: 0, r: 0 },
    t1: { x: 0, y: 0, z: 0, r: 0 },
    tX: []
  };

  // The navdata 
  this.navdata = {
    t0: { timestamp: new Date().getTime() },
    t1: { timestamp: new Date().getTime() },
    tX: []
  },

  // target: {
  //   altitude: 90,
  //   direction_empty: { vx: 0, vy: 0, vz: 0, vt: 0 },
  //   direction_control: { vx: 0, vy: 0, vz: 0, vt: 0 },
  //   direction_height:  { vx: 0, vy: 0, vz: 0, vt: 0 }
  // }, 

  this.client = ardrone.createClient({
    ip: (_id === 999 ? '192.168.1.1' : base_ip + _id),
    frameRate: 1
    //port: 5555
  });

  this.client.config('control:flying_mode', 0); // Default to NOT autopilot mode
  //this.client.config('pic:ultrasound_freq', 7 + (stageListDrones.indexOf(drone._id) % 2))
  this.client.config('general:navdata_demo', 'TRUE');
  this.client.config('general:navdata_options', 65536 + 8388608 + 67108864); 

  this.client.config('control:control_vz_max', CONTROL_Z_SPEED);
  this.client.config('control:control_vz_max', CONTROL_Z_SPEED);
  this.client.config('control:control_vz_max', CONTROL_Z_SPEED);
  this.client.config('control:control_vz_max', CONTROL_Z_SPEED);

  //drone.this.client.config('control:altitude_min',   50)
  //drone.this.client.config('control:altitude_max', 3000)

  // 1024 -> Altitude
  // 65536 -> Detect
  // 8388608 -> Wind speed
  // 67108864 -> WiFi

  this.client.config('video:codec_fps', 1);
  this.client.config('control:altitude_max','3000'); // 3 meter
  this.client.config('control:altitude_min','50'); // 5 cm
  // this.client.config('detect:detect_type', 12);  // detect roundell

  this.client.animateLeds('red', 1,1);

  /* Signal landed and flying events.
  this.client.on('landing', function () { });
  this.client.on('landed', function () { });
  this.client.on('takeoff', function() { });
  this.client.on('hovering', function() { });
  this.client.on('flying', function() { });*/
  
  // Save every navdata
  this.client.on('navdata', function(data) { 
    this.navdata.t1 = this.navdata.t0;
    this.navdata.t0.timestamp = new Date().getTime();
    this.navdata.t0 = data;
  });
}


module.exports = {
  lst: [],

  init: function(idArray, base_ip) {
    for(var i = 0; i < idArray.length; i++)
      this.lst.push(new Drone(idArray[i], base_ip));
  }
};
