module.exports = {}

var Body = require('./body.js');
var Vector = require('./vector.js');

// // TIMING
// var timer = new Date();
// var frameTime = timer.getTime();            // Instatiate initial timing objects
// var deltaTime = 15;
// var ping = 15;
// var steps = 0;
// var n = 20;

/**
 * Constucts a new simulator with array of bodies
 *
 * @constructor
 * @param {Array}  bodies   - The initial array of bodies

 */

function Simulator(bodies) {

    this.bodies = bodies

    this.G = 667.3;                 // Establish gravitational constant
    this.PI2 = Math.PI * 2;         // Establish this.PI2 constant

    this.saveInitialState(); // This saves the initial state of all bodies for "reset" functionality.

    this.outPositions = new Array(this.bodies.length);

    this.frameTime = timer.getTime();  

}

// Performs a step in the simulation
Simulator.prototype.simulate = function() {


    bodyDeleted = false; // This flag tracks if any body has been deleted

    // For each body
    for (var a = 0; a < this.bodies.length-1; a++) {

        // If not null
        if (this.bodies[a] != null) {
            var bodyA = this.bodies[a];
            bodyA.resetForce();

            // For each body below bodyA
            for (var b = a+1; b < this.bodies.length; b++) {

            	// If bodies are the same [THIS SHOULDN'T BE NECESSARY]
                if (a == b) {
                    console.log("Comparing body to self");
                }

                var bodyB = this.bodies[b];

                // If not null
                 if (this.bodies[b] != null) {

                    var r = this.getDistance(bodyA.position, bodyB.position);

                    // If collision
                    if (r < Math.max(bodyA.radius, bodyB.radius)) {

                        bodyDeleted = true;

                        // Body A is larger, absorb mass from body B and delete it.
                        if (bodyA.mass > bodyB.mass) {
                            this.bodies[a].addMass(this.bodies[b].mass);
                            this.bodies[b] = null;
                        }
                         // Body B is larger, absorb mass from body A and delete it.
                        else {
                            this.bodies[b].addMass(this.bodies[a].mass);
                            this.bodies[a] = null;
                        }
                    }

                    // If no collision
                    else {

                    	// Find the direction t
                        var theta = Math.atan((bodyB.y - bodyA.y) / (bodyB.x - bodyA.x));
                        if (bodyB.x < bodyA.x) {
                            theta += Math.PI;
                        }
                        if (theta >= this.PI2) {
                            theta -= this.PI2;
                        }
                        if (theta < 0) {
                            theta += this.PI2;
                        }
                        // Gravitational function { (G * m1 * m2)/(r^2) }
                        var tF = this.G * (bodyA.m * bodyB.m) / Math.pow(r, 2);

                        // Apply magnitude to vector using direction theta
                        var tFx = Math.cos(theta) * tF;
                        var tFy = Math.sin(theta) * tF;

                        // Adds force to body
                        bodyA.addForce(tFx, tFy);
                        bodyB.addForce(-tFx, -tFy);
                    }
                }
                
            }
        }
    }

    if (bodyDeleted) {this.removeNulls();} // REMOVE ALL NULLIFIED (via collision) BODIES

    timer = new Date();
    deltaTime = timer.getTime() - frameTime; // TIME KEEPING STUFF

    this.outPositions = new Array(this.bodies.length);
    for (var c = 0; c < this.bodies.length; c++) {
            this.bodies[c].applyForce(deltaTime / 1000);
            this.outPositions[c] = this.bodies[c].serializeUpdate();
    }

    // if (ping < 25) { // ONLY APPLY FORCE AND SEND UPDATE IF PING IS LOW ENOUGH TO MAINTAIN SUFFICIENT ACCURACY
    //     this.outPositions = new Array(this.bodies.length);
    //     for (var c = 0; c < this.bodies.length; c++) {
    //         this.bodies[c].applyForce(deltaTime / 1000);
    //         this.outPositions[c] = this.bodies[c].serializeUpdate();
    //     }
    //     if (bodyDeleted) { // IF A BODY HAS BEEN DELETED, WE NEED TO INITIALIZE ALL CLIENTS WITH NEW BODY INFO
    //         box = { command: 'initialize', bodies: this.initialize(), running: true};
    //     }
    //     else { // IF NOT, ONLY SEND POSITIONS
    //         box = { command: 'update', positions: this.outPositions, ping: ping};
    //     }
    // }
    // else {
    //     box = { command: 'wait', ping: ping};
    // }

    frameTime = timer.getTime();
    return bodies;

};

Simulator.prototype.initialize = function() {
    var initBodies = new Array(this.bodies.length);
    for(var i = 0; i < this.bodies.length; i++) {
        initBodies[i] = this.bodies[i].serializeInitial();
    }
    return initBodies;
};

Simulator.prototype.load = function(b) {
    this.bodies = new Array(b.length);
    for(var i = 0; i < b.length; i++) {
        this.bodies[i] = new Body( b[i][1], b[i][2],  b[i][3],   b[i][4], b[i][5], b[i][0], b[i][7]);
        this.bodies[i].c = b[i][6];
    }
};

Simulator.prototype.getDistance = function(v1,v2) {

    return Math.sqrt(Math.pow(v2.x-v1.x,2) + Math.pow(v2.y-v1.y,2));

};

Simulator.prototype.addBody = function(x,y,xx,yy,m,userID) {

    var newList = new Array(this.bodies.length+1);
    for(var i = 0; i < this.bodies.length; i++) {
        newList[i] = this.bodies[i];
        newList[i].bodyID = i;
    }
    newList[newList.length-1] = new Body(x,y,xx,yy,m,newList.length-1,userID);

    this.bodies = newList;

};

Simulator.prototype.destroyBody = function(bodyID) {

    var newList = new Array(this.bodies.length-1);
    var counter = 0;
    for(var i = 0; i < this.bodies.length; i++) {
        if (this.bodies[i].bodyID != bodyID) {
            newList[counter] = this.bodies[i];
            newList[counter].bodyID = counter;
            counter += 1;
        }
    }

    this.bodies = newList;


};

Simulator.prototype.removeNulls = function() {

    console.log("BEFORE");
    this.printState();

    var nullCount = 0;
    for(var a = 0; a < this.bodies.length; a++) {
        if (this.bodies[a] == null) {nullCount += 1;}
    }

    var newList = new Array(this.bodies.length-1-nullCount);
    var counter = 0;
    for(var i = 0; i < this.bodies.length; i++) {
        if (this.bodies[i] != null) {
            newList[counter] = this.bodies[i];
            newList[counter].bodyID = counter;
            counter += 1;
        }
    }

    this.bodies = newList;

    console.log("AFTER");
    this.printState();

    // pip install fabric
    // fab branch: [branch name]

};
Simulator.prototype.printState = function() {

    console.log("-- CURRENT STATE --");
    for(var i = 0; i < this.bodies.length; i++) {
        if (this.bodies[i] != null) {
            this.bodies[i].print();
        }
        else {
            console.log("ID: " + i + "\t (null)");
        }
    }
    console.log("");

};

Simulator.prototype.reset = function() {

    this.bodies = new Array(this.initialState.length);
    for(var i = 0; i < this.bodies.length; i++) {
        this.bodies[i] = this.initialState[i].cloneBody();
    }

};

Simulator.prototype.saveInitialState = function() {
    this.initialState = new Array(this.bodies.length);
    for(var i = 0; i < this.bodies.length; i++) {
        this.initialState[i] = this.bodies[i].cloneBody();
    }

};