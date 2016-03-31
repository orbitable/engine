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
    
    this.startAngle = this.getAngle(this.targetBody.position,this.centerBody.position) || 0;
    //this.oppositeAngle = this.addAngle(this.startAngle,Math.PI) || 0;
    
    this.lastAngle = this.startAngle;
    this.currentAngle = this.startAngle;
    
    //this.angularVelocity = 0.0;
    this.startTime = startTime;
    
    this.semiComplete = false;
    this.relativePosition = this.targetBody.position.add(this.centerBody.position.scalarProduct(-1));
    this.startQuad = OrbitTracker.getQuad(this.relativePosition);
    this.goalQuad = this.startQuad + 2;
    if (this.goalQuad > 4) {
        this.goalQuad -= 4;
    }
    
    this.orbitCount = 0;
    this.orbitTime = 0;
    
    console.log("ORBIT TRACKING INITIATED:\n" + this.toString());
   
}

OrbitTracker.PI2 = Math.PI * 2.0;

OrbitTracker.prototype.completeOrbit = function(time) {
    
    this.orbitCount += 1;
    console.log("TIME: " + ((time - this.startTime)));
    this.orbitTime = 
        this.orbitTime * ((this.orbitCount-1)/(this.orbitCount)) + 
        (time - this.startTime) * (1/(this.orbitCount));
    
    this.semiComplete = false;
    
    this.startTime = time;
    this.startAngle = this.getAngle(this.targetBody.position,this.centerBody.position);
    
    console.log(this.toString());
};

OrbitTracker.prototype.update = function(updateTime,deltaTime) {
    
        this.currentAngle = this.getAngle(this.targetBody.position,this.centerBody.position);
        
        if(this.semiComplete) {
            if (OrbitTracker.checkCross(this.lastAngle,this.currentAngle,this.startAngle)) {
                this.completeOrbit(updateTime);
            }
        } 
        else {
            this.relativePosition = this.targetBody.position.add(this.centerBody.position.scalarProduct(-1));
            if (OrbitTracker.getQuad(this.relativePosition) === this.goalQuad) {
                this.semiComplete = true;
            }
        }
        
        this.lastAngle = this.currentAngle;
};

OrbitTracker.prototype.addAngle = function(angle,add) {
    console.log(angle + " + " + add);
    var theta = angle + add;
    if (theta >= OrbitTracker.PI2) {
        theta -= OrbitTracker.PI2;
        console.log("Oversized theta. Fixing to: " + theta);
    }
    if (theta < 0) {
        theta += OrbitTracker.PI2;
        console.log("Undersized theta. Fixing to: " + theta);
    }
    return theta;
};

OrbitTracker.prototype.getAngle = function(positionA,positionB) {
    var theta = Math.atan((positionB.y - positionA.y) / (positionB.x - positionA.x));
    if (positionB.x < positionA.x) {
        theta += Math.PI;
    }
    if (theta >= OrbitTracker.PI2) {
        theta -= OrbitTracker.PI2;
    }
    if (theta < 0) {
        theta += OrbitTracker.PI2;
    }
    return theta;
};

OrbitTracker.getQuad = function (position) {
    if (position.x >= 0 ) {
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


/**
 * Takes in NON-NEGATIVE start and end values
 * Returns p
 */
// OrbitTracker.getAngularVelocity = function(start,end) {
//     var C;
//     var CC;
//     if (start < end) {
//         CC = end - start;
//         C  = -(start + (OrbitTracker.PI2 - end));
//     }
//     else {
//         C = end - start;
//         CC  = end + (OrbitTracker.PI2 - start);
//     }
    
//     if (Math.abs(C) < Math.abs(CC)) {
//         return C;
//     }
//     else {
//         return CC;
//     }
    
    
// };

OrbitTracker.checkCross = function(start,end,target) {
    var C;
    var CC;
    if (start < end) {
        CC = end - start;
        C  = -(start + (OrbitTracker.PI2 - end));
            
        if (Math.abs(C) < Math.abs(CC)) {
            // START < END, CLOCKWISE i.e. 0.1 -> 6.1
            if (target <= start || target >= end) {
                return true;
            }
        }
        else {
            // START < END, COUNTER-CLOCKWISE i.e  0.1 -> 0.2
            if (target >= start && target <= end) {
                return true;
            }
        }
    }
    else {
        C = end - start;
        CC  = end + (OrbitTracker.PI2 - start);
        
        if (Math.abs(C) < Math.abs(CC)) {
            // END < START, CLOCKWISE i.e  0.2 -> 0.1
            if (target <= start && target >= end) {
                return true;
            }
        }
        else {
            // END < START, COUNTER-CLOCKWISE i.e  6.1 -> 0.1
            if (target >= start || target <= end) {
                return true;
            }
        }
    }
    
    return false;
    
    
};


OrbitTracker.prototype.toString = function(bodyA,bodyB) {
    return "Target: " + this.targetBody.toString() + "\n" + 
    "Center: " + this.centerBody.toString() + "\n" + 
    "Quads: " + this.startQuad + "/" + this.goalQuad + "\n" + 
    "Semi: " + this.semiComplete + "\n" +
    "Orbit Time: " + this.orbitTime + " (" + this.orbitCount + ")";
}


module.exports = OrbitTracker;
