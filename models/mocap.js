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
          console.log(parameters.the3d);
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