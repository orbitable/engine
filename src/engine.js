//var Body = require('./body.js');
//var Vector = require('./vector.js');

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
    ]

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

        // If not null
        if (this.bodies[a] != null) {
            var bodyA = this.bodies[a];

            // For each body below bodyA
            for (var b = a+1; b < this.bodies.length; b++) {

            	// If bodies are the same [THIS SHOULDN'T BE NECESSARY]
                if (a == b) {
                    console.log("Comparing body to self");
                }

                var bodyB = this.bodies[b];

                // If not null
                 if (this.bodies[b] != null) {

                    var r = bodyA.position.distanceTo(bodyB.position);

                    // If collision
                    if (r < Math.max(bodyA.radius, bodyB.radius)) {

                        //bodyDeleted = true;

                        // Body A is larger, absorb mass from body B and delete it.
                        if (bodyA.mass > bodyB.mass) {
                            this.bodies[a].addMass(bodyB.mass);
                            this.bodies[b] = null;
                        }
                         // Body B is larger, absorb mass from body A and delete it.
                        else {
                            this.bodies[b].addMass(bodyA.mass);
                            this.bodies[a] = null;
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
        if (this.bodies[c] != null) {
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
}

// Simulator.prototype.initialize = function() {
//     var initBodies = new Array(this.bodies.length);
//     for(var i = 0; i < this.bodies.length; i++) {
//         initBodies[i] = this.bodies[i].serializeInitial();
//     }
//     return initBodies;
// };

// Simulator.prototype.load = function(b) {
//     this.bodies = new Array(b.length);
//     for(var i = 0; i < b.length; i++) {
//         this.bodies[i] = new Body( b[i][1], b[i][2],  b[i][3],   b[i][4], b[i][5], b[i][0], b[i][7]);
//         this.bodies[i].c = b[i][6];
//     }
// };

// Simulator.prototype.getDistance = function(v1,v2) {

//     return Math.sqrt(Math.pow(v2.x-v1.x,2) + Math.pow(v2.y-v1.y,2));

// };

// Simulator.prototype.addBody = function(x,y,xx,yy,m,userID) {

//     var newList = new Array(this.bodies.length+1);
//     for(var i = 0; i < this.bodies.length; i++) {
//         newList[i] = this.bodies[i];
//         newList[i].bodyID = i;
//     }
//     newList[newList.length-1] = new Body(x,y,xx,yy,m,newList.length-1,userID);

//     this.bodies = newList;

// };

// Simulator.prototype.destroyBody = function(bodyID) {

//     var newList = new Array(this.bodies.length-1);
//     var counter = 0;
//     for(var i = 0; i < this.bodies.length; i++) {
//         if (this.bodies[i].bodyID != bodyID) {
//             newList[counter] = this.bodies[i];
//             newList[counter].bodyID = counter;
//             counter += 1;
//         }
//     }

//     this.bodies = newList;


// };

// Simulator.prototype.removeNulls = function() {

//     console.log("BEFORE");
//     this.printState();

//     var nullCount = 0;
//     for(var a = 0; a < this.bodies.length; a++) {
//         if (this.bodies[a] == null) {nullCount += 1;}
//     }

//     var newList = new Array(this.bodies.length-1-nullCount);
//     var counter = 0;
//     for(var i = 0; i < this.bodies.length; i++) {
//         if (this.bodies[i] != null) {
//             newList[counter] = this.bodies[i];
//             newList[counter].bodyID = counter;
//             counter += 1;
//         }
//     }

//     this.bodies = newList;

//     console.log("AFTER");
//     this.printState();

//     // pip install fabric
//     // fab branch: [branch name]

// };

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
        if (this.bodies[i] != null) {
            console.log("ID: " + i + "\t " + this.bodies[i].toString());
        }
        else {
            console.log("ID: " + i + "\t (null)");
        }
    }
    console.log("");

};



// Simulator.prototype.reset = function() {

//     this.bodies = new Array(this.initialState.length);
//     for(var i = 0; i < this.bodies.length; i++) {
//         this.bodies[i] = this.initialState[i].cloneBody();
//     }

// };

// Simulator.prototype.saveInitialState = function() {
//     this.initialState = new Array(this.bodies.length);
//     for(var i = 0; i < this.bodies.length; i++) {
//         this.initialState[i] = this.bodies[i].cloneBody();
//     }

// };

//module.exports = Simulator;