var Body = require('./body.js');
var Vector = require('./vector.js');

/**
 * A simulator that stores body attributes and can calculate steps of a simulation
 *
 * @constructor
 */
function OrbitTracker(targetBody,centerBody,startTime) {
    
    this.targetBody = targetBody;
    this.centerBody = centerBody;
    this.startAngle = this.getAngle(this.targetBody,this.centerBody);
    
    
    this.startTime = startTime;
    
    this.semiComplete = false;
    this.relativePosition = this.targetBody.position.add(this.centerBody.position.scalarProduct(-1));
    this.startQuad = this.getQuad(this.relativePosition);
    this.goalQuad = this.startQuad + 2;
    if (this.goalQuad > 4) {
        this.goalQuad -= 4;
    }
    
    this.orbitCount = 0;
    this.orbitTime = 0;
   
}

OrbitTracker.prototype.getQuad = function(position) {
    if (position.x >= 0) {
        if (position.y >= 0) {
            return 1;
        }
        else {
            return 4;
        }
    }
    else {
        if (position.y >= 0) {
            return 2;
        }
        else {
            return 3;
        }
    }
};

OrbitTracker.prototype.completeOrbit = function(time) {
    
    this.orbitCount += 1;

    this.orbitTime = 
        this.orbitTime * ((this.orbitCount-1)/(this.orbitCount)) + 
        (time - this.startTime) * (1/(this.orbitCount));
    
    this.semiComplete = false;
    
    this.startTime = time;
    this.startAngle = this.getAngle(this.targetBody,this.centerBody);
    
    console.log(this.toString());
};

OrbitTracker.prototype.update = function(updateTime) {
    
    if (this.semiComplete) {
        var currentAngle = this.getAngle(this.targetBody,this.centerBody);
        if (Math.abs(currentAngle - this.startAngle) < 0.1) {
            this.completeOrbit(updateTime);
        }
    }
    else {
        this.relativePosition = this.targetBody.position.add(this.centerBody.position.scalarProduct(-1));
        var currentQuad = this.getQuad(this.relativePosition);
        if (currentQuad == this.goalQuad) {
            this.semiComplete = true;
        }
    }
    
    
};

OrbitTracker.prototype.getAngle = function(bodyA,bodyB) {
    var theta = Math.atan((bodyB.position.y - bodyA.position.y) / (bodyB.position.x - bodyA.position.x));
    if (bodyB.position.x < bodyA.position.x) {
        theta += Math.PI;
    }
    if (theta >= this.PI2) {
        theta -= this.PI2;
    }
    if (theta < 0) {
        theta += this.PI2;
    }
    return theta;
};

OrbitTracker.prototype.toString = function(bodyA,bodyB) {
    return "Target: " + this.targetBody.toString() + "\n" + 
    "Center: " + this.centerBody.toString() + "\n" + 
    "Quads: " + this.startQuad + "/" + this.goalQuad + "\n" + 
    "Semi: " + this.semiComplete + "\n" +
    "Orbit Time: " + this.orbitTime + " (" + this.orbitCount + ")";
}


module.exports = OrbitTracker;
