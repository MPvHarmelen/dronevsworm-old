

var AccelarationToPower = function(reqA){
 var c = [0, (0.5), 0];
 return c[0] + c[1] * reqA; // + c[2] * Math.pow(reqA,2);
}

var VelocityToPower = function(reqV){
 var c = [0, (1/50), 0];
 return c[0] + c[1] * reqV; // + c[2] * reqV^2;
}

var GetControlVelocity = function(reqV, currentV){
    return reqV - currentV;
}

var GetRequiredVelocity = function(distance) {
    var THRESHOLD_DISTANCE = 1000; // in mm
    var MAX_SPEED = 0.6;

    if (distance > THRESHOLD_DISTANCE)
        return MAX_SPEED;
    else
        return MAX_SPEED * Math.abs(distance) * distance / Math.pow(THRESHOLD_DISTANCE, 2);
}

module.exports = function(target, mocap){
    // console.log(target.x);
    // console.log(target.y);
    // console.log(target.z);
    // console.log(mocap.p.x);
    // console.log(mocap.p.y);
    // console.log(mocap.p.z);
    // console.log(mocap.v.vx);
    // console.log(mocap.v.vy);
    // console.log(mocap.v.vz);
    var axes = ["x", "y", "z"];
    var result = {vYaw: 0};
    for (var i = 0; i < axes.length; i++) {
        var axis = axes[i];
        distance = target[axis] - mocap.p[axis];
        var reqV = GetRequiredVelocity(distance);
        result["v" + axis] = GetControlVelocity(reqV, mocap.v["v" + axis]);
    };
    // console.log(result);
    return result;
}
