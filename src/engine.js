var Body = require('./body.js');
var Vector = require('./vector.js');

/**
 * A simulator that stores body attributes and can calculate steps of a simulation
 *
 * @constructor
 */
function Simulator() {
    
    this.idCounter = 0
    this.bodies = [];
    
    this.G = bigNum(6.674,-11);             // Establish gravitational constant
    this.PI2 = Math.PI * 2;         // Establish this.PI2 constant
    
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

/**
 * Resests the current simulation with a new set of bodies.
 *
 * @param {array} bodies - A collection of body objects
 */
Simulator.prototype.reset = function(bodies) {

  bodies = bodies || [];

  this.bodies = bodies.map(function(body) {
    if (body instanceof Body) return body;

    var position = new Vector(body.position.x, body.position.y);
    var velocity = new Vector(body.velocity.x, body.velocity.y);

    return new Body(body.mass, position, velocity, body.radius, body.luminosity);
  });
  
  this.assignIDs()
  
};

/**
 * Reassigns all bodyIDS to ensure they are unique
 */

Simulator.prototype.assignIDs = function() {
    this.idCounter = 0;
    this.bodies.forEach(function(body) { 
        body.id = this.idCounter;
        this.idCounter += 1;
    });
};

/**
 * Adds a body given an x and y coordinate. Other attributes are generated.
 * @param {Number}  x - x position coordinate
 * @param {Number}  y - y position coordinate
 */

Simulator.prototype.addBody = function(body) {
    var newBody = new Body(
        body.mass,
        body.position,
        body.velocity,
        body.radius,
        body.luminosity
    ); 
    newBody.id = this.idCounter;
    this.idCounter += 1;
    this.bodies.push(newBody); 
}

/**
 * Deletes body with given id
 * @param {Number}  id - Unique id of body to be deleted
 */

Simulator.prototype.deleteBody = function(id) {
    this.bodies
        .filter(function(body) { 
            body.id === id; 
        })
        .forEach(function(body) { 
            body.destroy(); 
        });
}

/**
 * Calculates a step in the simulation
 * @param {int}  dT - the dT to use in integration (in seconds)
 */

Simulator.prototype.update = function(dT) {

    // For each body
    for (var a = 0; a < this.bodies.length-1; a++) {

        // If exists
        if (this.bodies[a].exists) {
            var bodyA = this.bodies[a];

            // For each body below bodyA
            for (var b = a+1; b < this.bodies.length; b++) {

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



    // Now that all the forces have been calculated, we can apply them to the bodies to update their velocities and positions.
    for (var c = 0; c < this.bodies.length; c++) {
        if (this.bodies[c].exists) {
            this.bodies[c].applyForce(dT);
            this.simulationTime += dT;
        }
    }

    this.step += 1;
    return;

};




/**
 * Prints the state of bodies in the scene
 *
 */
Simulator.prototype.printState = function() {

    console.log("-- CURRENT STATE -- (" + this.step + ")");
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
