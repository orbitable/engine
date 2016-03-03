var Body = require('./body.js');
var Vector = require('./vector.js');

/**
 * Constucts a new simulator with array of bodies
 *
 * @constructor
 * @param {Array}  bodies   - The initial array of bodies

 */

function Simulator(bodies) {

    this.bodies = bodies;

    this.G = 667.3;                 // Establish gravitational constant
    this.PI2 = Math.PI * 2;         // Establish this.PI2 constant

    this.resumed = false;
    this.timer = new Date();
    this.frameTime = this.timer.getTime();  
    this.startTime = this.frameTime;
    this.deltaTime = 15.0;
    this.step = 0;
    this.simulationTime = 0.0;

}

/**
 * Returns a Number given a number in scientific notation format
 *
 * @param {Number}  b   - The base of the scientific notation i.e. b * 10 ^ e
 * @param {Number}  e   - The exponent of the scientific notation i.e. b * 10 ^ e

 */

function bigNum(b,e) {
    return b * Math.pow(10,e);
}

function Simulator() {

    this.bodies = [];

    // This chunk creates an earth-sun orbit
    // this.bodies = [
    //     new Body(bigNum(5.9721986,24),new Vector(bigNum(1.483,11),0.0),new Vector(0.0,29722),bigNum(6.3674447,6)), // EARTH
    //     new Body(bigNum(1.988435,30),new Vector(0.0,0.0),new Vector(0.0,0.0),bigNum(6.955,8)) // SUN
    // ];

    this.G = bigNum(6.674,-11);             // Establish gravitational constant
    this.PI2 = Math.PI * 2;         // Establish this.PI2 constant

    this.resumed = false;
    this.timer = new Date();
    this.frameTime = this.timer.getTime();  
    this.startTime = this.frameTime;
    this.deltaTime = 15.0;
    this.step = 0;
    this.simulationTime = 0.0;

}

var parseBody = function (body) {
  if (body instanceof Body) return body;

  var position = new Vector(body.position.x, body.position.y);
  var velocity = new Vector(body.velocity.x, body.velocity.y);
  return new Body(body.radius, position, velocity, null);
};

/**
 * Resests the current simulation with a new set of bodies.
 *
 * @param {array} bodies - A collection of body objects
 */
Simulator.prototype.reset = function(bodies) {
  bodies = bodies || [];
  this.bodies = bodies.map(parseBody);
};

/**
 * Calculates a step in the simulation
 * @param {int}  dT - the dT to use in integration
 */
Simulator.prototype.update = function(dT) {


    //bodyDeleted = false; // This flag tracks if any body has been deleted

    // For each body
    for (var a = 0; a < this.bodies.length-1; a++) {

        // If exists
        if (this.bodies[a].exists) {
            var bodyA = this.bodies[a];

            // For each body below bodyA
            for (var b = a+1; b < this.bodies.length; b++) {

            	// If bodies are the same [THIS SHOULDN'T BE NECESSARY]
                if (a == b) {
                    console.log("Comparing body to self");
                }

                var bodyB = this.bodies[b];

                // If exists
                 if (this.bodies[b].exists) {

                    var r = bodyA.position.distanceTo(bodyB.position);

                    // If collision
                    if (r < Math.max(bodyA.radius, bodyB.radius)) {

                        //bodyDeleted = true;

                        // Body A is larger, absorb mass from body B and delete it.
                        if (bodyA.mass > bodyB.mass) {
                            this.bodies[a].addMass(bodyB.mass);
                            this.bodies[b].destroy();
                        }
                         // Body B is larger, absorb mass from body A and delete it.
                        else {
                            this.bodies[b].addMass(bodyA.mass);
                            this.bodies[a].destroy();
                        }
                    }

                    // If no collision
                    else {

                    	// Find the direction t
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
                        // Gravitational function { (G * m1 * m2)/(r^2) }
                        var tF = this.G * (bodyA.mass * bodyB.mass) / Math.pow(r, 2);

                        // Apply magnitude to vector using direction theta
                        var tFx = Math.cos(theta) * tF;
                        var tFy = Math.sin(theta) * tF;

                        // Adds force to body
                        bodyA.addForce(new Vector(tFx, tFy));
                        bodyB.addForce(new Vector(-tFx, -tFy));
                    }
                }
                
            }
        }
    }

    timer = new Date();

    // this.resumed is set in resume(). 
    // This prevents the simulator from calculating a new deltaTime that would otherwise be however large, depending on pause duration.
    if (this.resumed) {
        this.resumed = false;
    } else {
        this.timer = new Date();
        this.deltaTime = this.timer.getTime() - this.frameTime; // TIME KEEPING STUFF
    }

    // Now that all the forces have been calculated, we can apply them to the bodies to update their velocities and positions.
    for (var c = 0; c < this.bodies.length; c++) {
        if (this.bodies[c].exists) {
            //this.bodies[c].applyForce(this.deltaTime / 1000); LEGACY 
            this.bodies[c].applyForce(dT);
            this.simulationTime += dT;
        }
    }

    this.frameTime = this.timer.getTime();
    this.step += 1;
    return;

};

/**
 * Sets the resume flag so that the simulator knows not to use a large deltaTime when resuming
 *
 */
Simulator.prototype.resume = function () {
    this.resumed = true;
};



/**
 * Prints the state of bodies in the scene
 *
 */
Simulator.prototype.printState = function() {

    console.log("-- CURRENT STATE -- (" + this.step + ")");
    console.log("dT: " + this.deltaTime);
    console.log("Time Passed: " + ((this.timer.getTime() - this.startTime)/1000.0));
    console.log("Simulation Time: " + this.simulationTime);
    for(var i = 0; i < this.bodies.length; i++) {
        if (this.bodies[i].exists) {
            console.log("ID: " + i + "\t " + this.bodies[i].toString());
        }
        else {
            console.log("ID: " + i + "\t (destroyed)");
        }
    }
    console.log("");

};

module.exports = Simulator;
