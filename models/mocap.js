//////////////////////////////////////////////////////////////////////////////////
///////////////////////////////// MOCAP //////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
var colors   = require('colors');
var qtmrt = require('qualisys-rt');
var API = qtmrt.Api;
var api = new API({ debug: true });

api.on('frame', function(data) {

  // StoreFrame(data);
  console.log(data);
  // console.log('Received frame:'.green);
  // console.log(data);
});

api.on('error', function() { console.log('Connection error!'.red) }); //api.disconnect();
api.on('end', function(data) { console.log('No more data!'.red); }); //api.disconnect();
api.on('event', function(event) { console.log(event.name.yellow); });
api.on('disconnect', function(event) { process.exit(); });

module.exports = {
  lst: [],
  getLastFrame: function(_id) {
  },

  stop: function() { api.stopStreaming(); },
  start: function(port, ip) {
    try{
      api.connect(port, ip)
        .then(function() { return api.qtmVersion(); })
        .then(function(version) { return api.byteOrder(); })
        .then(function(byteOrder) { return api.getState(); })
        .then(function() { return api.discover(); })
        //.then(function() { return api.discover(); })
        //.then(function(servers) { console.log(servers); })

        // Get's the current frame
        // .then(function(state) { return api.getCurrentFrame(qtmrt.COMPONENT_ANALOG); })
        .then(function() { return api.getParameters('All'); })
        .then(function(parameters) {
          console.log(parameters.the6d);
          // console.log(parameters.the3d);
        })
        //.then(function() { return api.streamFrames({ components: ['All'], frequency: 1/100 }) })
        //.then(function() { return api.streamFrames({ components: ['All'], frequency: 1/10 }) })
        //.then(function() { return api.streamFrames({ components: ['All'], frequency: 'AllFrames' }) })
        //.then(function() { return api.streamFrames({ components: ['2D'], frequency: '2' }) })
        //.then(function() { return api.streamFrames({ components: ['Image'], frequency: '2' }) })
        //.then(function() { return api.streamFrames({ components: ['3D'], frequency: 1/50 }) })
        //.then(function() { return api.streamFrames({ udpPort: 15000, components: ['3D'], frequency: 1/100 }) })
        //.then(function() { return api.streamFrames({ components: ['3D'] }) })
        //.then(function() { return api.streamFrames({ components: ['Force', 'Image', 'Analog', 'AnalogSingle', '6D', '3D', '2D'], frequency: 'AllFrames' }) })
        //.then(function() { return api.streamFrames({ frequency: 100, components: ['3DNoLabels'] }); })
        //.then(function() { return api.streamFrames({ frequency: 1/100, components: ['3DRes'] }); })
        //.then(function() { return api.streamFrames({ frequency: 1/100, components: ['3DNoLabelsRes'] }); })
        //.then(function() { return api.streamFrames({ frequency: 1/100, components: ['6D'] }); })
        //.then(function() { return api.streamFrames({ frequency: 1/100, components: ['6DRes'] }); })
        //.then(function() { return api.streamFrames({ frequency: 1/100, components: ['6DEuler'] }); })
        //.then(function() { return api.streamFrames({ frequency: 1/100, components: ['6DEulerRes'] }); })
        //.then(function() { return api.streamFrames({ frequency: 1/100, components: ['Analog'] }); })
        //.then(function() { return api.streamFrames({ frequency: 1/100, components: ['AnalogSingle'] }); })
        //.then(function() { return api.streamFrames({ frequency: 1/100, components: ['Force'] }); })
        //.then(function() { return api.streamFrames({ frequency: 1/100, components: ['ForceSingle'] }); })
        //.then(function() { return api.streamFrames({ frequency: 1/100, components: ['Image'] }); })
        //.then(function() { return api.streamFrames({ frequency: 1/200, components: ['GazeVector'] }); })


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
}

// //////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////// MOCAP //////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////
// var colors   = require('colors');
// var qtmrt = require('qualisys-rt');
// var µs = require('microseconds');
// var API = qtmrt.Api;
// var api = new API({ debug: true });

// var Drone = function(_id){
//   this.id = _id;
//   this.rgbColor; 
//   this._6dIndex; 
//   this.points = [];  
// }

// var Point  = function(){ 
//   this.p = { x : 0, y : 0, z : 0}; 
//   this.v = { vx : 0, vy : 0, vz : 0}; 
//   this.t = 0; 
//   this.est = false; 
// }



// var lst = []; 
// function CreateDroneList(rigidBodies){
//   rigidBodies.forEach(function(rigidBody, index){ 
//     newDrone = new Drone(rigidBody.name); 
//     newDrone.rgbColor = rigidBody.rgbColor; 
//     newDrone._6dIndex = index; 
//     lst.push(newDrone); 
//   }); 
//   console.log(lst)
// }

// api.on('frame', function(data) {
//   // perhaps better to look at frame rate instead of us.now(), this has 10% error
//   var time = µs.now(); 
//   var dataPoint = []; 
//   lst.forEach(function(drone){ 
//     drone.points.push(NewPoint(data, time, drone._6dIndex))
//   })
//   console.log(lst); 
// });

// //returns a point
// function NewPoint(data, time, index){
//   var newPoint = new Point(); 
//   if (positionKnown(data, index)){
//     newPoint.p = {
//       x : data.components['6d'].rigidBodies[index].x, 
//       y: data.components['6d'].rigidBodies[index].y, 
//       z: data.components['6d'].rigidBodies[index].z}; 
//     newPoint.t = time; 
//     newPoint.v = detV(data, index, lst[index], newPoint); 
//     newPoint.est = false; }
//   else if (!positionKnown(data, index)){
//     newPoint.v = getFirstNonEst(data, index, lst[index]).v; 
//     newPoint.p = estP(data, index, lst[index], newPoint); 
//     newPoint.est = true;}
//   newPoint.t = time;
//   return newPoint; 
// }

// // deterime new velocity, return velocity 
// function detV(data, index, curDrone, curPoint){
//   var prevPoint = getFirstNonEst(data, index, curDrone); 
//   var v = { 
//     x : (curPoint.p.x - prevPoint.p.x)/(curPoint.t-prevPoint.t), 
//     y : (curPoint.p.y - prevPoint.p.y)/(curPoint.t-prevPoint.t), 
//     z : (curPoint.p.z - prevPoint.p.z)/(curPoint.t-prevPoint.t)}; 
//   return v; 
// }

// //estimate new position, return position 
// function estP(data, index, curDrone, curPoint){ 
//   var prevPoint =  getFirstNonEst(data, index, curDrone); 
//   var p = {
//     x : prevPoint.p.x + Math.abs(curPoint.t - prevPoint.t)*prevPoint.v.x, 
//     y : prevPoint.p.y + Math.abs(curPoint.t  - prevPoint.t)*prevPoint.v.y,
//     z : prevPoint.p.z + Math.abs(curPoint.t - prevPoint.t)*prevPoint.v.z,
//   }
//   return p; 
// }

// //check if position in new point is known
// function positionKnown(data, index){     
//   if ( data.components['6d'].rigidBodies[index].x === null || 
//         data.components['6d'].rigidBodies[index].y === null ||
//         data.components['6d'].rigidBodies[index].z === null){
//     return false; 
//   }
//   else { return true }
// }

// //returns first non-estimate point 
// function getFirstNonEst(data, index, curDrone){ 
//   //loop backwards through list
//   var firstNonEst; 
//   console.log(curDrone.points)
//   curDrone.points.some(function(point){
//     if (point.est === false){ 
//       firstNonEst = point.est; 
//       return true; 
//     }
//   })
//   if (undefined === firstNonEst){ 
//     firstNonEst = { p : { x : 0, y : 0, z : 0}, 
//                v : { vx : 0, vy : 0, vz : 0}, 
//                est : false, 
//                t : 0};
//   }
//   return firstNonEst;
// }
  
  


// api.on('error', function() { console.log('Connection error!'.red) }); //api.disconnect();
// api.on('end', function(data) { console.log('No more data!'.red); }); //api.disconnect();
// api.on('event', function(event) { console.log(event.name.yellow); });
// api.on('disconnect', function(event) { process.exit(); });

// api.connected = false;

// module.exports = {
//   lst: lst,
//   start: function(port, ip) {
//     if(api.connected) return;
//     try {
//       api.connect(port || "22223", ip || "localhost")
//         .then(function() { return api.qtmVersion(); })
//         .then(function(version) { return api.byteOrder(); })
//         .then(function(byteOrder) { return api.getState(); })
//         .then(function() { return api.discover(); })
//         .then(function() { return api.getParameters('All'); })
//         .then(function(parameters) {
//           CreateDroneList(parameters.the6d.rigidBodies); 
//         })
//         .then(function() { return api.streamFrames({ frequency: 1/500, components: ['6D'] }); })
//         .then(function() { return api.streamFrames({ frequency: 1/500, components: ['6D'] }); })
//         .catch(function(err) {
//           console.log('QTS Internal error');
//           console.log(err);
//         })
//       ;
//     } catch(err) {
//       console.log('QTS Connection error')
//       console.log(err)
//     }
//   }
// }