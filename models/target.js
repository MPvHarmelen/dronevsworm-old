//////////////////////////////////////////////////////////////////////////////////
///////////////////////////////// TARGET //////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
var microS = require('microseconds');

// Implement formular for circle

module.exports = {
  
  Get: function(id) {

	var time = new Date().getTime();

	// basic 
	var amp = 1000; // amplitude in mm
	var freq = 5 * 1000; //frequency in ms 
	var bottom = 1000; //bottom in mm
	var sin = amp * Math.sin((2*Math.PI * time) / freq) + (amp + bottom); 
	
	// return { x: (-500 + 500 * id), y: -1500, z: sin, yaw: 0 };
    return { x: 250, y:-1500, z:1800, yaw: 0 };
  },
};
