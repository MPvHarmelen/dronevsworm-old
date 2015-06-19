'use strict'

// Constants
var CURRENT_BASE_IP = '192.168.255.';
var CONTROL_UP_SPEED = 2000;

// Globals
var microS = require('microseconds');


//////////////////////////////////////////////////////////////////////////////////
///////////////////////////////// DRONE //////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

var flock = require('./models/flock.js');

flock.init([999,0,1,2,3,4], '192.168.1.20');

//////////////////////////////////////////////////////////////////////////////////
///////////////////////////////// MOCAP //////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

var mocap = require('./models/mocap.js');

mocap.start('22223', '192.168.1.3');
// mocap.start('22223', '192.168.253.1');


//////////////////////////////////////////////////////////////////////////////////
///////////////////////////////// TARGET //////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

var target = require('./models/target.js');

//////////////////////////////////////////////////////////////////////////////////
///////////////////////////////// VIEWS //////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

var views = require('./models/views.js');

views.app.io.route('Update_DroneState', function(req) {
	flock.Action([req.data.id], req.data.state);
})

views.app.io.route('Update_DroneControl', function(req) {
	for(var i = 0; i < flock.lst.length; i ++) {
		flock.lst[i].go.control = req.data;
	}
})

//////////////////////////////////////////////////////////////////////////////////
///////////////////////////////// LOOPS //////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// SendCommand kan een nieuw commando geven op basis van verschillende modellen. Het verbeteren van deze modellen zal mogelijk een belangrijk onderdeel zijn van het succes van de show.
// INPUT: X,Y,Z,R + vX, vY, vZ, vR Drone
// OUTPUT: X, Y, Z, R Drone
var SendCommand = function() {

	for(var i = 0; i < flock.lst.length; i++) {

	var drone = flock.lst[i];

	// console.log('drone' + drone.id)
	// console.log(mocap.GetLastPointById(drone.id))
	var droneTarget = target.Get(drone.id);
	var droneCurrent = mocap.GetLastPointById(drone.id)[0]; 

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


	var c1 = (1/75); // deltaX
	var c2 = -1/1.3;   // deltaY
	var reqP = {
		vx : c1 * deltaP.x + c2 * deltaV.x,
		vy : c1 * deltaP.y + c2 * deltaV.y,
		vz : c1 * deltaP.z,
		vYaw : -50 * deltaP.yaw
	}

	drone.go.autopilot = reqP;

	// Send go command
	drone.Go();
	}
};

var AccelarationToPower = function(reqA){ 
 var c = [0, (0.5), 0]; 
 return c[0] + c[1] * reqA; // + c[2] * Math.pow(reqA,2); 
} 

var VelocityToPower = function(reqV){
 var c = [0, (1/50), 0]; 
 return c[0] + c[1] * reqV; // + c[2] * reqV^2; 
}

// Doel: Veiligheid gehele systeem checken
// Per seconde: 1 ~ 10
// Safety check doet verschillende checks (zoals genoemd in safety measures) indien de situatie als onveilig wordt aangekaart kan besloten worden alle drones te laten laden.
// INPUT: TUTI
// OUTPUT: Veiligheid situatie
var SafetyCheck = function() {

	// Connection lost make drone stop
	SafetyCheck_CheckConnection();


}

var SafetyCheck_CheckConnection = function() {

	// For how long does the system have to wait for safety to kick in
	var SafetyTime = 500;
    for(var i = mocap.lst.length; i--; ) {
		
    	var lastMeasured = mocap.lst[i].GetLastPoint_NotEstimated();
    	if((microS.now() - lastMeasured.t) > 1500 * 1000) flock.Action(mocap.lst[i].id, 'safeOff');

    	// We might turn safety off somehow
    	else {}
    }
}

// UpdateDisplay
// Doel: Stuurt de huidige stand van zaken naar alle clients die aan het luisteren zijn.
// Per seconde: 10 ~ 20
// Door update display blijft iemand die naar de monitor kijkt op de hoogte van wat er gebeurt in de computer. 
var UpdateDisplay = function() {

	views.UpdateDisplay({
		lstFlock: flock.lst,
		lstMocap: mocap.lst
	});
}


// DoFunction handles two important parts of functions. The first
// is how many times a second a function has to run. 
//
// TODO: The second more important fact is that it checks if it has done
// it before it starts the next.
var DoFunction = function(timesPerSecond, functionToDo) {
	setInterval(functionToDo, Math.round(1000 / timesPerSecond));
}

DoFunction(20, SendCommand);
DoFunction( 1, SafetyCheck);
DoFunction(10, UpdateDisplay);