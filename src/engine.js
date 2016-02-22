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

function Simulator() {

    this.bodies = [
        new Body(10, new Vector(-100,0), new Vector(0,0), 10),
        new Body(100, new Vector(-0,0)   , new Vector(0,0), 10),
        new Body(12, new Vector(100,0) , new Vector(0,0), 10),

        new Body(10, new Vector(0,-100), new Vector(0,0), 10),
        new Body(10, new Vector(100,100)   , new Vector(0,0), 10),
        new Body(12, new Vector(0,100) , new Vector(0,0), 10),

        new Body(10, new Vector(150,-200), new Vector(0,0), 10),
        new Body(10, new Vector(-100,-100)   , new Vector(0,0), 10),
        new Body(12, new Vector(-150,200) , new Vector(0,0), 10)
    ];

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
                            this.bodies[b].exists = false;
                        }
                         // Body B is larger, absorb mass from body A and delete it.
                        else {
                            this.bodies[b].addMass(bodyA.mass);
                            this.bodies[a].exists = false;
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
