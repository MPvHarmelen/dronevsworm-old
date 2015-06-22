var AccelarationToPower = function(reqA){ 
 var c = [0, (0.5), 0]; 
 return c[0] + c[1] * reqA; // + c[2] * Math.pow(reqA,2); 
} 

var VelocityToPower = function(reqV){
 var c = [0, (1/50), 0]; 
 return c[0] + c[1] * reqV; // + c[2] * reqV^2; 
}

var Algoritm_Empty = function(param, drone, target, mocap) {

}

var Algoritm_Basic = function(param, drone, target, mocap) {

	var droneTarget = target;
	var droneCurrent = mocap;

	var deltaP = { 
		x : (droneTarget.x - droneCurrent.p.x) / (1000/10), // (1000/10) is hz to ms
		y : (droneTarget.y - droneCurrent.p.y) / (1000/10),
		z : (droneTarget.z - droneCurrent.p.z) / (1000/10), 
		yaw : (droneTarget.yaw - droneCurrent.p.yaw) / (1000/10)
	}

	var deltaV = { 
		x : (deltaP.x - droneCurrent.v.x) / (1000/10), // (1000/10) is hz to ms
		y : (deltaP.y - droneCurrent.v.y) / (1000/10),
		z : 0, 
		yaw : 0 
	}

	var detlaA = {};

	var c1 = param.c1.val / 1000; // deltaX
	var c2 = param.c2.val / 1000; // deltaY

	return {
		vx : c1 * deltaP.x + c2 * deltaV.x,
		vy : c1 * deltaP.y + c2 * deltaV.y,
		vz : c1 * deltaP.z,
		vYaw : -50 * deltaP.yaw
	}
}

// var ObjectToArray = function(objectKey) {
// 	var objectArray = [];
// 	console.log(this[objectKey])
// 	Object.keys(this[objectKey]).forEach(function(key) {
// 		var object = this[objectKey][key];
// 		object.key = key;
// 		objectArray.push(object);		
// 	})
// 	return objectArray;
// }

module.exports = {

	// Active algoritm
	Algoritm_Active: "basic",

	// Array of possible algoritms
	// The use of each of these algoritms can be controlled on the "/control" page
	// There it will also be possible to set values of params if defined
	Algoritm: {
		empty: { 
			Calc: Algoritm_Empty,
			Param: {

			}
		},
		basic: {
			Calc: Algoritm_Basic,	
			Param: {
				c1: { lbl: 'C1 Afstand', min: -100, max: 100, val: 0},
				c2: { lbl: 'C2 Snelheid', min: -100, max: 100, val: 0},
			}
		} 
	},

	// The real calculation
	Calc: function(drone, target, mocap) {

		// Get algoritm
		var alg = this.Algoritm[this.Algoritm_Active];
		
		var stop = { vx: 0, vy: 0, vz: 0, vYaw: 0 };
		var calc;
		// Perform algoritm
		if(alg) calc = alg.Calc(alg.Param, drone, target, mocap);

		// If the algoritm doesn't return anything still make sure something is sent to drone
		return calc || stop;
	}
}
