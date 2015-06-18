
//////////////////////////////////////////////////////////////////////////////////
///////////////////////////////// MOCAP //////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
var colors   = require('colors');
var qtmrt = require('qualisys-rt');
var microS = require('microseconds');
var API = qtmrt.Api;
var api = new API({ debug: true });

var lst = []; 

var Drone = function(_id){
  this.id = _id.replace('woodlandDrone', ''); // Number in Woodland_Drone_0
  this.name = _id;
  this.rgbColor; 
  this._6dIndex;
  this.points = [];  
}

Drone.prototype.AddPoint = function(lstRigidBodies, time) {

  var rigidBody = lstRigidBodies[this._6dIndex];
  var newPoint = new Point(); 
  newPoint.t = time;
  newPoint.est = (rigidBody.x === null || rigidBody.y === null || rigidBody.z === null);

  // Object location needs estimation
  if (newPoint.est) {

    // Lastpoint
    var lastPoint = this.GetLastPoint();
    newPoint.v = lastPoint.v;
    newPoint.p = {
      x : lastPoint.p.x + Math.abs(newPoint.t - lastPoint.t)*lastPoint.v.x, 
      y : lastPoint.p.y + Math.abs(newPoint.t - lastPoint.t)*lastPoint.v.y,
      z : lastPoint.p.z + Math.abs(newPoint.t - lastPoint.t)*lastPoint.v.z,
    }

  // Object location is known
  } else {
    var lastPoint = this.GetLastPoint_NotEstimated();
    newPoint.p = {
      x: rigidBody.x, 
      y: rigidBody.y, 
      z: rigidBody.z
    };
    newPoint.v = { 
      x : (newPoint.p.x - lastPoint.p.x)/(newPoint.t-lastPoint.t), 
      y : (newPoint.p.y - lastPoint.p.y)/(newPoint.t-lastPoint.t), 
      z : (newPoint.p.z - lastPoint.p.z)/(newPoint.t-lastPoint.t)
    }; 
  }
  this.points.push(newPoint);
}


Drone.prototype.GetLastPoint_NotEstimated = function() {

  var pointsLength = this.points.length;
  if(pointsLength > 0) {
    for(var i = pointsLength; i--; ) {
      if(this.points[i].est === false) return this.points[i]
    }
  }
  return new Point();
}

Drone.prototype.GetLastPoint = function() {

  var pointsLength = this.points.length;
  if(pointsLength > 0) return this.points[pointsLength - 1];
  return new Point();
}

var Point  = function(){ 
  this.p = { x : 0, y : 0, z : 0}; 
  this.v = { vx : 0, vy : 0, vz : 0}; 
  this.t = 0; 
  this.est = false; 
}

var CreateDroneList = function (parameters){

  var rigidBodies = parameters.the6d.rigidBodies;
  if (!Array.isArray(rigidBodies)){rigidBodies = [rigidBodies]}; 
  rigidBodies.forEach(function(rigidBody, index){ 
    newDrone = new Drone(rigidBody.name); 
    newDrone.rgbColor = rigidBody.rgbColor; 
    newDrone._6dIndex = index; 
    lst.push(newDrone); 
  }); 
  // console.log(lst)
}

api.on('frame', function(data) {
  
  // TODO: Better to look at frame rate instead of us.now(), this has 10% error
  var time = microS.now(); 
  var lstRigidBodies = data.components['6d'].rigidBodies;

  // Foreach drone calculate/estimate location and speed
  for(var i = 0; i < lst.length; i++) lst[i].AddPoint(lstRigidBodies, time)
});

api.on('error', function() { console.log('Connection error!'.red) }); //api.disconnect();
api.on('end', function(data) { console.log('No more data!'.red); }); //api.disconnect();
api.on('event', function(event) { console.log(event.name.yellow); });
api.on('disconnect', function(event) { process.exit(); });

var ApiStart = function(port, ip) {
  try {
    api.connect(port || "22223", ip || "localhost")
      // .then(function() { return api.qtmVersion(); })
      // .then(function(version) { return api.byteOrder(); })
      // .then(function(byteOrder) { return api.getState(); })
      // .then(function() { return api.discover(); })
      .then(function() { return api.getParameters('All'); })

      // Create dronelist
      .then(CreateDroneList)

      // Get all RIGID Bodies
      .then(function() { return api.streamFrames({ frequency: 1/2, components: ['6D'] }); })

      .catch(function(err) {
        console.log('QTS Internal error');
        console.log(err);
      })
    ;
  } catch(err) {
    console.log('QTS Connection error')
    console.log(err)
  }
}

module.exports = {
  lst: lst,
  start: ApiStart,

  GetLastPointById: function(id) {

    for(var i = lst.length; i--; ) if(lst[i].id == id) {
      return [lst[i].GetLastPoint()];
    }
    return [new Point()];
  },

  GetLastPointsById: function(id, count) {
    // TODO Implement multiple points
  }
}
