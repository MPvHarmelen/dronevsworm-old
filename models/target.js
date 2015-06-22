//////////////////////////////////////////////////////////////////////////////////
///////////////////////////////// TARGET //////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
var microS = require('microseconds');

// Implement formular for circle

module.exports = {
  
  Get: function(id) {

	var time = new Date().getTime();

	//////////// basic up and down ///////////////////////
	var amp = 1000; // amplitude in mm
	var freq = 5 * 1000; //frequency in ms 
	var bottom = 1000; //bottom in mm
	var sin = amp * Math.sin((2*Math.PI * time) / freq) + (amp + bottom); 
    return { x: (-500 + 500 * id), y: -1500, z: sin, yaw: 0 };

    ///////////// basic lemniscate ///////////////////////
    // var xVar = 2000; //variation in the x-direction
    // var yVar = 1000; //variation in the y-direction
    // var freq = 5 * 1000; //frequency in ms 
    // var denominator = (Math.pow(Math.sin((2*Math.PI * time) / freq), 2) + 1) ; 
    // var xTarget = (xVar * Math.cos((2*Math.PI * time) / freq)) / denominator ; 
    // var yTarget = (yVar * Math.cos((2*Math.PI * time) / freq) * Math.sin((2*Math.PI * time) / freq)) / denominator); 
    // return {x : xTarget, y : yTarget, z = 1500, yaw : 0};
  },
};
