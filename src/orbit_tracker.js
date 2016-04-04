var Body = require('./body.js');
var Vector = require('./vector.js');

/**
 * A tool that tracks orbit periods over several completions and reports an average orbit time.
 *
 * @constructor
 * @param {Body} targetBody - The body that is orbiting
 * @param {Body} centerBody - The body that the targetBody is orbitting around
 * @param {Vector} startTime  - The timestamp for the start of the first orbit
 */
function OrbitTracker(targetBody,centerBody,startTime) {
    this.reset(targetBody,centerBody,startTime);
}

/**
 * Sets initial settings for tracking
 *
 * @param {Number} startTime - Start time for this orbit
 */
OrbitTracker.prototype.initialize = function(startTime) {
    this.startAngle = OrbitTracker.getAngle(this.targetBody.position,this.centerBody.position) || 0;
    this.lastAngle = this.startAngle;
    this.currentAngle = this.startAngle;
    
    this.startTime = startTime;
    
    this.semiComplete = false;
    
    this.relativePosition = this.targetBody.position.add(this.centerBody.position.scalarProduct(-1));
    this.getStartQuads(this.relativePosition);
};

OrbitTracker.prototype.setState = function(state,startTime) {
    if (state) {
        this.reset(this.targetBody,this.centerBody,startTime);
        this.running = true;
    }
    else {
        this.running = false;
    }
}

OrbitTracker.prototype.reset = function(targetBody,centerBody,startTime) {
    this.targetBody = targetBody;
    this.centerBody = centerBody;
    
    this.orbitCount = 0;
    this.orbitTime = 0;
    
    this.minTime = Number.POSITIVE_INFINITY;
    this.maxTime = Number.NEGATIVE_INFINITY;
    this.timeRange = 0;
    
    this.running = false;
    if ((this.targetBody instanceof Body) && (this.centerBody instanceof Body)) {
        this.initialize(startTime);
    }
}

OrbitTracker.prototype.setCenterBody = function(centerBody,startTime) {
    if (centerBody != this.targetBody) {
        this.reset(this.targetBody,centerBody,startTime);
    } 
}

OrbitTracker.prototype.setTargetBody = function(targetBody,startTime) {
    if (targetBody != this.centerBody) {
        this.reset(targetBody,this.centerBody,startTime);
    } 
}

/**
 * Sets initial startQuad and goalQuad values
 *
 * @param {Vector} position - The relative position of the body
 */
OrbitTracker.prototype.getStartQuads = function(quadPosition) {
    this.startQuad = OrbitTracker.getQuad(quadPosition);
    this.goalQuad = this.startQuad + 2;
    if (this.goalQuad > 4) {
        this.goalQuad -= 4;
    }
};


OrbitTracker.PI2 = Math.PI * 2.0;

/**
 * Completes an orbit, calculating a new average orbit time and resetting values to prepare for next orbit
 *
 * @param {Number} time - The timestamp of orbit completion
 */
OrbitTracker.prototype.completeOrbit = function(time) {
    
    
    
    this.orbitCount += 1;
    console.log("TIME: " + ((time - this.startTime)));
    this.orbitTime = 
        this.orbitTime * ((this.orbitCount-1)/(this.orbitCount)) + 
        (time - this.startTime) * (1/(this.orbitCount));
        
    this.minTime = Math.min(this.minTime,this.orbitTime);
    this.maxTime = Math.max(this.maxTime,this.orbitTime);
    this.timeRange = (Math.max(0.0,this.maxTime - this.minTime)/this.orbitTime) * 100.0;
    
    this.initialize(time);
    
    //console.log(this.toString());
};

/**
 * Performs a check of the orbit state
 *
 * @param {Number} updateTime - The timestamp of the current state of the simulator
 * @param {Number} deltaTime  - The timestep of the current simulation frame
 */
OrbitTracker.prototype.update = function(updateTime,deltaTime) {

    if (this.running) {
    
        this.currentAngle = OrbitTracker.getAngle(this.targetBody.position,this.centerBody.position);
        
        if(this.semiComplete) {
            this.checkFull(updateTime);
        } 
        else {
            this.checkSemi();
        }
        
        this.lastAngle = this.currentAngle;
    }
};

/**
 * Checks to see if the entire orbit is completed
 *
 * @param {Number} updateTime - The timestamp of the current state of the simulator
 */
OrbitTracker.prototype.checkFull = function(updateTime) {
    if (OrbitTracker.checkCross(this.lastAngle,this.currentAngle,this.startAngle)) {
        this.completeOrbit(updateTime);
    }
};

/**
 * Checks to see if half the orbit has been completed
 *
 */
OrbitTracker.prototype.checkSemi = function() {
    this.relativePosition = this.targetBody.position.add(this.centerBody.position.scalarProduct(-1));
    if (OrbitTracker.getQuad(this.relativePosition) === this.goalQuad) {
        this.semiComplete = true;
    }
};


/**
 * Returns the angle from positionA to positionB
 *
 * @param {Vector} positionA  - The origin position
 * @param {Vector} positionB  - The angle target position
 */
OrbitTracker.getAngle = function(positionA,positionB) {
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

/**
 * Returns the quadrant number (1,2,3,4) of the given vector
 *
 * @param {Vector} position - The origin position
 */
OrbitTracker.getQuad = function (quadPosition) {
    /**
     *  2 | 1
     *  - - -
     *  3 | 4
     */
    if (quadPosition.x >= 0 ) {
        if (quadPosition.y >= 0) {
            return 1;
        }
        else {
            return 4;
        }
    }
    else {
        if (quadPosition.y >= 0) {
            return 2;
        }
        else {
            return 3;
        }
    }
};

/**
 * Returns true if 'target' is between 'start' and 'end'
 *
 * @param {Number} start - Bound of range
 * @param {Number} end  - Bound of range
 * @param {Number} target  - Target angle
 */
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

/**
 * Returns string representation of OrbitTracker state
 */
OrbitTracker.prototype.toString = function() {
    return "Target: " + this.targetBody.toString() + "\n" + 
    "Center: " + this.centerBody.toString() + "\n" + 
    "Quads: " + this.startQuad + "/" + this.goalQuad + "\n" + 
    "Semi: " + this.semiComplete + "\n" +
    "Orbit Time: " + this.orbitTime + " (" + this.orbitCount + ")";
}


module.exports = OrbitTracker;
