/* Copyright 2016 Orbitable Team Members
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use
 * this file except in compliance with the License.  You may obtain a copy of the
 * License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed
 * under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations under the License.
 */

var Body = require('./body.js');
var Note = require('./note.js');
var Vector = require('./vector.js');
var OrbitTracker = require('./orbit_tracker.js');

/**
 * A simulator that stores body attributes and can calculate steps of a simulation
 *
 * @constructor
 */
function Simulator() {

    this.idCounter = 0
    this.bodies = [];
    this.notes = [];
    
    this.notes.push(new Note({position:  new Vector( 149597870700, 189597870700), startTime:  4000000, duration: 4000000, title: "TEST TITLE 1", text: "TEST TEXT 1"}));
    this.notes.push(new Note({position:  new Vector( 149597870700,-189597870700), startTime:  8000000, duration: 4000000, title: "TEST TITLE 2", text: "TEST TEXT 2"}));
    this.notes.push(new Note({position:  new Vector(-149597870700, 149597870700), startTime: 12000000, duration: 4000000, title: "TEST TITLE 3", text: "TEST TEXT 3"}));
    this.notes.push(new Note({position:  new Vector(-149597870700,-149597870700), startTime: 16000000, duration: 4000000, title: "TEST TITLE 4", text: "TEST TEXT 4"}));    
    
    this.orbitTracker = new OrbitTracker();

    this.G = this.bigNum(6.674,-11);             // Establish gravitational constant
    this.PI2 = Math.PI * 2;         // Establish this.PI2 constant

    this.step = 0;
    this.simulationTime = 0.0;
    
    this.selectedBody = {}
    
    this.pauseFrame = false;

}

/**
 * Returns a Number given a number in scientific notation format
 *
 * @param {Number}  b   - The base of the scientific notation i.e. b * 10 ^ e
 * @param {Number}  e   - The exponent of the scientific notation i.e. b * 10 ^ e
 */

Simulator.prototype.bigNum = function(b,e) {
    return b * Math.pow(10,e);
}

/**
 * Resests the current simulation with a new set of bodies.
 *
 * @param {array} bodies - A collection of body objects
 */
Simulator.prototype.reset = function(bodies) {

  bodies = bodies || [];
  this.orbitTracker = new OrbitTracker();

  this.bodies = bodies.map(function(body) {
    if (body instanceof Body) return body;

    var position = new Vector(body.position.x, body.position.y);
    var velocity = new Vector(body.velocity.x, body.velocity.y);

    return new Body(body.mass, position, velocity, body.radius, body.luminosity);
  });

  this.assignIDs()
  
  this.orbitTracker = new OrbitTracker(this.bodies[3],this.bodies[0],0);

};

/**
 * Reassigns all bodyIDS to ensure they are unique
 */

Simulator.prototype.assignIDs = function() {
    var tempID = 0;
    this.bodies.forEach(function(body) {
        body.id = tempID;
        tempID += 1;
    });
    this.idCounter = tempID;
};

/**
 * Adds a body given an Object with any attributes, the rest will be generated
 * @param {Object}  body - Body or Body-like object with any combination of attributes
 */

Simulator.prototype.addBody = function(body) {

    if (body.position) {
        var position = new Vector(body.position.x, body.position.y);
    }
    if (body.velocity) {
        var velocity = new Vector(body.velocity.x, body.velocity.y);
    }

    var newBody = new Body(
        body.mass,
        position,
        velocity,
        body.radius,
        body.luminosity
    );
    newBody.id = this.idCounter;
    // console.log(newBody.id);
    this.idCounter += 1;
    this.bodies.push(newBody);
};

/**
 * Deletes body with given id
 * @param {Number}  id - Unique id of body to be deleted
 */

Simulator.prototype.deleteBody = function(id) {
    this.bodies = this.bodies.filter(function(body) {
        return (body.id != id);
    });
};

/**
 * Updates body with given id with given data
 * @param {Number}  id - Unique id of body to be updated
 * @param {Object}  data - Data to update with
 */

Simulator.prototype.updateBody = function(id,data) {
    this.bodies = this.bodies.map(function(body) {
        if(body.id == id) {
            body.update(data);
        }

        return body;
    });
    // this.bodies = this.bodies.filter(function(body) {
    //     return (body.id === id);
    // }).forEach(function(body) {
    //     body.update(data);
    // });
    // this.bodies.forEach(function(body){
    //     if(body.id === id)
    // })
};

/**
 * Returns true if bodies are colliding, false otherwise
 * @param {Body}  bodyA - first Body
 * @param {Body}  bodyB - other Body
 * @param {Number}  distance - distance between bodies
 */

Simulator.prototype.checkCollision = function(bodyA,bodyB,distance) {
    return (distance < bodyA.radius + bodyB.radius);
    //return (distance < Math.max(bodyA.radius, bodyB.radius)); ALTERNATIVE OPTION
};

/**
 * Applies result of collision between two bodies
 * @param {Body}  bodyA - first Body
 * @param {Body}  bodyB - other Body
 */

Simulator.prototype.applyCollision = function(bodyA,bodyB) {
    // Body A is larger, absorb mass from body B and delete it.
    if (bodyA.mass > bodyB.mass) {
        bodyA.addMass(bodyB.mass);
        bodyB.destroy();
    }
    // Body B is larger, absorb mass from body A and delete it.
    else {
        bodyB.addMass(bodyA.mass);
        bodyA.destroy();
    }
};

/**
 * Returns angle in radians from bodyA to bodyB
 * @param {Body}  bodyA - first Body
 * @param {Body}  bodyB - other Body
 */

Simulator.prototype.getAngle = function(bodyA,bodyB) {
    var theta = Math.atan((bodyB.position.y - bodyA.position.y) / (bodyB.position.x - bodyA.position.x));
    if (bodyB.position.x < bodyA.position.x) {
        theta += Math.PI;
    }
    // if (theta >= this.PI2) {
    //     theta -= this.PI2;
    // }
    if (theta < 0) {
        theta += this.PI2;
    }
    return theta;
};

/**
 * Returns force magnitude given masses and distance
 * @param {Body}  massA - first Body mass
 * @param {Body}  massB - other Body mass
 * @param {Number} distance - distance between bodies
 */

Simulator.prototype.getGravity = function(massA,massB,distance) {
    // Prevent division by 0
    if (distance === 0) {
        // A distance of 0 would imply no direction, so no force
        return 0;
    }
    // Gravitational function
    return this.G * (massA * massB) / Math.pow(distance, 2);
};

/**
 * Returns a vector with given angle and magnitude
 * @param {Number}  angle - angle
 * @param {Number}  magnitude - magnitude
 */

Simulator.prototype.getVector = function(angle,magnitude) {
   return new Vector(Math.cos(angle) * magnitude, Math.sin(angle) * magnitude);
};

/**
 * Applies accumulated forces for each body that still 'exists'
 * @param {Number}  dT - Number of seconds passed
 */

Simulator.prototype.applyForces = function(dT) {
    this.bodies.forEach(function(body) {
        if (body.exists) {
            body.applyForce(dT);
        }
    });
};

/**
 * Calculates a step in the simulation
 * @param {int}  dT - the dT to use in integration (in seconds)
 */

Simulator.prototype.update = function(dT) {

    if (this.pauseFrame) {
        this.pauseFrame = false;
    }
    else {
        
        // For each body
        for (var a = 0; a < this.bodies.length-1; a++) {

            // If exists
            if (this.bodies[a].exists) {
                var bodyA = this.bodies[a];

                // For each body below bodyA
                for (var b = a+1; b < this.bodies.length; b++) {

                    // If exists
                    if (this.bodies[b].exists) {
                        var bodyB = this.bodies[b];

                        // Get distance between bodies
                        var distance = bodyA.position.distanceTo(bodyB.position);

                        // If collision
                        if (this.checkCollision(bodyA,bodyB,distance)) {
                            // Apply collision
                            this.applyCollision(bodyA,bodyB);
                        }

                        // If no collision
                        else {

                            // Find the direction t
                            var forceAngle = this.getAngle(bodyA,bodyB);
                            // Get magnitude of force for gravitational function
                            var forceMagnitude = this.getGravity(bodyA.mass,bodyB.mass,distance);
                            // Apply magnitude to vector using direction theta
                            var forceVector = this.getVector(forceAngle,forceMagnitude);

                            // Adds force to body
                            bodyA.addForce(forceVector);
                            bodyB.addForce(forceVector.scalarProduct(-1));
                        }
                    }

                }
            }
        }

        // Now that all the forces have been calculated, we can apply them to the bodies to update their velocities and positions.
        this.applyForces(dT);
        
        this.simulationTime += dT;
        
        if (this.orbitTracker !== null) {
            this.orbitTracker.update(this.simulationTime);
        }

        this.step += 1;
        return;
    }
};

/**
 * Returns a string detailing the state of bodies in the scene
 *
 */

Simulator.prototype.toString = function() {

    var line = "-- CURRENT STATE -- (" + this.step + ")\n" +
        "Simulation Time: " + this.simulationTime;

    for(var i = 0; i < this.bodies.length; i++) {
        if (this.bodies[i].exists) {
            line = line + "ID: " + i + "\t " + this.bodies[i].toString();
        }
        else {
            line = line + "ID: " + i + "\t (destroyed)";
        }
    }

    return line + "\n";

};

module.exports = Simulator;
