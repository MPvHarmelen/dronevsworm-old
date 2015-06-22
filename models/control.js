

var AccelarationToPower = function(reqA){ 
 var c = [0, (0.5), 0]; 
 return c[0] + c[1] * reqA; // + c[2] * Math.pow(reqA,2); 
} 

var VelocityToPower = function(reqV){
 var c = [0, (1/50), 0]; 
 return c[0] + c[1] * reqV; // + c[2] * reqV^2; 
}

module.exports = function(target, mocap){



  return { vx: 0, vy: 0, vz: 0, vYaw: 0 };
}