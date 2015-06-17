//////////////////////////////////////////////////////////////////////////////////
///////////////////////////////// MOCAP //////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
var colors   = require('colors');
var qtmrt = require('qualisys-rt');
var API = qtmrt.Api;
var api = new API({ debug: true });

api.on('frame', function(data) {
  // console.log('Received frame:'.green);
  // console.log(data);
});

api.on('error', function() { console.log('Connection error!'.red) }); //api.disconnect();
api.on('end', function(data) { console.log('No more data!'.red); }); //api.disconnect();
api.on('event', function(event) { console.log(event.name.yellow); });
api.on('disconnect', function(event) { process.exit(); });

module.exports = {
  lst: [],

  start: function(port, ip) {
    try{
      api.connect(port, ip)
        .then(function() { return api.qtmVersion(); })
        .then(function(version) { return api.byteOrder(); })
        .then(function(byteOrder) { return api.getState(); })
        .then(function() { return api.discover(); })
        .then(function() { return api.streamFrames({ frequency: 1/100, components: ['6D'] }); })
        .then(function() { return api.streamFrames({ frequency: 1/100, components: ['6D'] }); })

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