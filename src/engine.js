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
    this.idCounterNotes = 0
    this.bodies = [];
    this.notes = [];
    
    this.orbitTracker = new OrbitTracker();

    this.G = this.bigNum(6.674,-11);             // Establish gravitational constant
    this.PI2 = Math.PI * 2;         // Establish this.PI2 constant

    this.step = 0;
    this.simulationTime = 0.0;
    
    this.selectedBody = {};
    
    this.pauseFrame = false;
    
    this.resetState = {
        bodies: [],
        notes: []
    };
    this.hasBeenModified = false;
    
    this.assignIDs();

}

/**
 * Returns a Number given a number in scientific notation format
 *
 * @param {Number}  b   - The base of the scientific notation i.e. b * 10 ^ e
 * @param {Number}  e   - The exponent of the scientific notation i.e. b * 10 ^ e
 */

Simulator.prototype.bigNum = function(b,e) {
    return b * Math.pow(10,e);
};

Simulator.prototype.isEditable = function() {
    return (this.step === 0);
}

Simulator.prototype.resetLocal = function() {
    
    var tID = this.orbitTracker.targetBody.name;
    var cID = this.orbitTracker.centerBody.name;
    this.orbitTracker = new OrbitTracker();
    
    
    
    this.bodies = this.resetState.bodies.map(function(body) {
        return body.copy();
    });
    
    this.orbitTracker.setCenterBody(
        this.bodies.filter(
            function(body) {
                return (body.name === cID);
            }
        )[0] || null
    );
    
    this.orbitTracker.setTargetBody(
        this.bodies.filter(
            function(body) {
                return (body.name === tID);
            }
        )[0] || null
    );
    
    this.resetValues();
    
};

/**
 * Resests the current simulation with a new set of bodies.
 *
 * @param {array} bodies - A collection of body objects
 */
Simulator.prototype.reset = function(bodies,notes) {
  bodies = bodies || [];
  notes  = notes  || [];
  this.orbitTracker = new OrbitTracker();
  this.bodies = bodies.map(function(body) {
    if (body instanceof Body) return body;

    var position = new Vector(body.position.x, body.position.y);
    var velocity = new Vector(body.velocity.x, body.velocity.y);


    return new Body(body.mass, position, velocity, body.radius, body.luminosity, body.name, body.color);
  });
  this.notes = notes.map(function(note) {
    if (note instanceof Note) return note;
    
    var position = new Vector(note.position.x, note.position.y);


    return new Note({
        title: note.title, 
        text: note.text, 
        startTime: note.startTime, 
        duration: note.duration, 
        position: position
    });
    
  });
  
  this.hasBeenModified = false;
  
  this.setResetBodies();
  this.setResetNotes();
  this.resetValues();

};

Simulator.prototype.resetValues = function () {
    
  this.assignIDs();
  this.simulationTime = 0.0;
  this.step = 0;
  this.selectedBody = {};
  this.pauseFrame = false;
    
};

Simulator.prototype.setResetBodies = function() {
    this.hasBeenModified = true;
    this.resetState.bodies = this.bodies.map(function(body) {
        return body.copy();
    });
};

Simulator.prototype.setResetNotes = function() {
    this.hasBeenModified = true;
    this.resetState.notes = this.notes.map(function(note) {
        return note.copy();
    });
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
    
    tempID = 0;
    
    this.notes.forEach(function(note) {
        note.id = tempID;
        tempID += 1;
    });
    
    this.idCounterNotes = tempID;
};

/**
 * Adds a body given an Object with any attributes, the rest will be generated
 * @param {Object}  body - Body or Body-like object with any combination of attributes
 */

Simulator.prototype.addBody = function(body) {

    if (body.position) {
        var position = new Vector(body.position.x || 0, body.position.y || 0);
    }
    if (body.velocity) {
        var velocity = new Vector(body.velocity.x || 0, body.velocity.y || 0);
    }

    var newBody = new Body(
        body.mass,
        position,
        velocity,
        body.radius,
        body.luminosity
    );
    newBody.id = this.idCounter;
    this.idCounter += 1;
    this.bodies.push(newBody);
    
    this.setResetBodies();
    
    return newBody;
    
};

Simulator.prototype.addNote = function(note) {

    note.id = this.idCounterNotes;
    this.idCounterNotes += 1;

    if (note.position) {
        note.position = new Vector(note.position.x, note.position.y);
    }
    
    note.startTime = this.simulationTime;
    
    var newNote = new Note(note);
    this.notes.push(newNote);
    
    this.setResetNotes();
    
    return newNote;
};

/**
 * Deletes body with given id
 * @param {Number}  id - Unique id of body to be deleted
 */

Simulator.prototype.deleteBody = function(id) {
    this.bodies = this.bodies.filter(function(body) {
        return (body.id != id);
    });
    
    this.setResetBodies();
    
};

Simulator.prototype.deleteNote = function(id) {
    this.notes = this.notes.filter(function(note) {
        return (note.id != id);
    });
    
    this.setResetNotes();
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
    
    this.setResetBodies();
    
    // this.bodies = this.bodies.filter(function(body) {
    //     return (body.id === id);
    // }).forEach(function(body) {
    //     body.update(data);
    // });
    // this.bodies.forEach(function(body){
    //     if(body.id === id)
    // })
};

Simulator.prototype.updateNote = function(id,data) {
    this.notes = this.notes.map(function(note) {
        if(note.id == id) {
            note.update(data);
        }

        return note;
    });
    
    this.setResetNotes();
    
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
    } else {
        
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
