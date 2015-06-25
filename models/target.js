//////////////////////////////////////////////////////////////////////////////////
///////////////////////////////// TARGET //////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
var microS = require('microseconds');

var centerOfShow = {
	x: 250,
	y: -1500,
} 

// Implement formular for circle

///////////// basic lemniscate ///////////////////////
var lemniscate = function(time) {

	var xVar = 2250; //variation in the x-direction
	var yVar = 1250; //variation in the y-direction
	var freq = 15 * 1000; //frequency in ms 
	var denominator = (Math.pow(Math.sin((2*Math.PI * time) / freq), 2) + 1) ; 
	var xTarget = (xVar * Math.cos((2*Math.PI * time) / freq)) / denominator; 
	var yTarget = (yVar * Math.cos((2*Math.PI * time) / freq) * Math.sin((2*Math.PI * time) / freq) / denominator); 
	return {x : xTarget + centerOfShow.x, y : yTarget + centerOfShow.y, z: 2000, yaw : 0};
}

module.exports = {
  
  Get: function(id) {

	var time = new Date().getTime();

    return { x: 0, y: 0, z:1800, yaw: 0 };
	return lemniscate(time);

	// basic 
	var amp = 1000; // amplitude in mm
	var freq = 5 * 1000; //frequency in ms 
	var bottom = 1000; //bottom in mm
	var sin = amp * Math.sin((2*Math.PI * time) / freq) + (amp + bottom); 

	// return { x: (-500 + 500 * id), y: -1500, z: sin, yaw: 0 };
    // return { x: 250, y:-1500, z:1800, yaw: 0 };
  },
};
