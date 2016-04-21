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

var _          = require('lodash');
var Body       = require('../src/body.js');
var expect     = require('chai').expect;
var Simulation = require('../src/engine.js');
var Vector     = require('../src/vector.js');

describe('Simulation', function() {
    
   it('should start with empty array of bodies', function() {
       simulation = new Simulation();
       expect(simulation.bodies).to.be.empty;
   });
    
    
    
    describe('reset', function() {
        it('set the simulation time to 0', function() {
          var simulation = new Simulation();
          expect(simulation.simulationTime).to.be.equal(0.0);

          simulation.update(1000);

          expect(simulation.simulationTime).to.be.equal(1000.0);

          simulation.reset([]);
          expect(simulation.simulationTime).to.be.equal(0.0);
        });

        it('should reset with given bodies', function() {
            var simulation = new Simulation();
            expect(simulation.bodies).to.be.empty;

            var body = {
                mass: 1,
                position: {x: 1, y: 2},
                radius: 1,
                velocity: {x: 3, y: 4},
                luminosity: 1234
            };

            simulation.reset([body]);
            expect(simulation.bodies).not.to.be.empty;

            var parsedBody = simulation.bodies[0];
            expect(parsedBody instanceof Body).to.be.true;
            expect(parsedBody.mass).to.equal(body.mass);
            expect(parsedBody.radius).to.equal(body.radius);
            expect(parsedBody.position.x).to.equal(1);
            expect(parsedBody.position.y).to.equal(2);
            expect(parsedBody.velocity.x).to.equal(3);
            expect(parsedBody.velocity.y).to.equal(4);
            expect(parsedBody.density).to.be.a('number');
            expect(parsedBody.luminosity).to.equal(1234);
        });
        
        it('should reset with actual Body instances given', function() {
            var simulation = new Simulation();
            expect(simulation.bodies).to.be.empty;

            var body = new Body(
                1,
                new Vector(1,2),
                new Vector(3,4),
                1,
                1234
            );

            simulation.reset([body]);
            expect(simulation.bodies).not.to.be.empty;

            var parsedBody = simulation.bodies[0];
            expect(parsedBody instanceof Body).to.be.true;
            expect(parsedBody.mass).to.equal(body.mass);
            expect(parsedBody.radius).to.equal(body.radius);
            expect(parsedBody.position.x).to.equal(1);
            expect(parsedBody.position.y).to.equal(2);
            expect(parsedBody.velocity.x).to.equal(3);
            expect(parsedBody.velocity.y).to.equal(4);
            expect(parsedBody.density).to.be.a('number');
            expect(parsedBody.luminosity).to.equal(1234);
        });
        
        it('should assign empty body array if passed nothing', function() {
            var simulation = new Simulation();
            expect(simulation.bodies).to.be.empty;
            
            simulation.addBody(new Body());

            simulation.reset();
            expect(simulation.bodies).to.be.empty;

        });
    });
  
  describe('addBody', function() {
  it('should add given body', function() {
    var simulation = new Simulation();
    expect(simulation.bodies).to.be.empty;

    var body = {
      mass: 1,
      position: {x: 1, y: 2},
      radius: 1,
      velocity: {x: 3, y: 4},
      luminosity: 1234
    };

    simulation.addBody(body);
    expect(simulation.bodies).not.to.be.empty;

    var parsedBody = simulation.bodies[0];
    expect(parsedBody instanceof Body).to.be.true;
    expect(parsedBody.mass).to.equal(body.mass);
    expect(parsedBody.radius).to.equal(body.radius);
    expect(parsedBody.position.x).to.equal(1);
    expect(parsedBody.position.y).to.equal(2);
    expect(parsedBody.velocity.x).to.equal(3);
    expect(parsedBody.velocity.y).to.equal(4);
    expect(parsedBody.density).to.be.a('number');
    expect(parsedBody.luminosity).to.equal(1234);
  });
  
    it('should add given body with only position', function() {
    var simulation = new Simulation();
    expect(simulation.bodies).to.be.empty;

    var body = {
      position: {x: 1, y: 2},
    };

    simulation.addBody(body);
    expect(simulation.bodies).not.to.be.empty;

    var parsedBody = simulation.bodies[0];
    expect(parsedBody instanceof Body).to.be.true;
    expect(parsedBody.mass).to.be.a('number');
    expect(parsedBody.radius).to.be.a('number');
    expect(parsedBody.position.x).to.equal(1);
    expect(parsedBody.position.y).to.equal(2);
    expect(parsedBody.velocity.x).to.be.a('number');
    expect(parsedBody.velocity.y).to.be.a('number');
    expect(parsedBody.density).to.be.a('number');
    expect(parsedBody.luminosity).to.be.a('number');
  });
  });
  
  describe('deleteBody', function() {
    it('should delete bodies with given ID', function() {
        var simulation = new Simulation();
        expect(simulation.bodies).to.be.empty;

        var body = {
        mass: 1,
        position: {x: 1, y: 2},
        radius: 1,
        velocity: {x: 3, y: 4},
        luminosity: 1234
        };

        simulation.addBody(body);
        expect(simulation.bodies).not.to.be.empty;

        var parsedBody = simulation.bodies[0];
        var parsedID = parsedBody.id;
        
        expect(parsedBody instanceof Body).to.be.true;
        
        simulation.deleteBody(parsedID+1);
        expect(simulation.bodies).not.to.be.empty;
        
        simulation.deleteBody(parsedID);
        expect(simulation.bodies).to.be.empty;

    });
  });
  
    describe('updateBody', function() {
    it('should update bodies with given ID and data', function() {
        var simulation = new Simulation();
        expect(simulation.bodies).to.be.empty;

        var body = {
            mass: 1,
            position: {x: 1, y: 2},
            radius: 1,
            velocity: {x: 3, y: 4},
            luminosity: 1234
        };
        var body2 = {
            mass: 2,
            position: {x: 2, y: 3},
            radius: 2,
            velocity: {x: 4, y: 5},
            luminosity: 2345
        };

        simulation.addBody(body);
        simulation.addBody(body2);
        expect(simulation.bodies).not.to.be.empty;

        var parsedBody = simulation.bodies[0];
        var parsedBody2 = simulation.bodies[1];
        var parsedID = parsedBody2.id;
        
        expect(parsedBody instanceof Body).to.be.true;
        
        simulation.updateBody(parsedID,{position: {x: 6}});
        expect(parsedBody.position.x).to.equal(1);
        expect(parsedBody2.position.x).to.equal(6);
        expect(parsedBody2.position.y).to.equal(3);

    });
  });
  
  describe('checkCollision', function() {
    it('should return true if bodies intersect, false otherwise', function() {
        var simulation = new Simulation();
        expect(simulation.bodies).to.be.empty;

        var body = {
            mass: 1,
            position: {x: 0, y: 0},
            radius: 1,
            velocity: {x: 0, y: 0},
            luminosity: 0
        };
        simulation.addBody(body);
        
        body = {
            mass: 1,
            position: {x: 2, y: 2},
            radius: 1,
            velocity: {x: 0, y: 0},
            luminosity: 0
        };
        simulation.addBody(body);
        
        var bodyA = simulation.bodies[0];
        var bodyB = simulation.bodies[1];
        var distance = bodyA.position.distanceTo(bodyB.position);
        
        expect(simulation.checkCollision(bodyA,bodyB,distance)).to.equal(false);
        
        bodyB.position = new Vector(0.5,0);
        distance = bodyA.position.distanceTo(bodyB.position);
        
        expect(simulation.checkCollision(bodyA,bodyB,distance)).to.equal(true);

    });
  });
  
 describe('applyCollision', function() {
     
     
    it('should destroy smaller body and add mass to larger body', function() {
        var simulation = new Simulation();
        expect(simulation.bodies).to.be.empty;

        var massA = 1;
        var massB = 2;

        var body = {
            mass: massA
        };
        simulation.addBody(body);
        
        body = {
            mass: massB
        };
        simulation.addBody(body);
        
        var bodyA = simulation.bodies[0];
        var bodyB = simulation.bodies[1];
        
        simulation.applyCollision(bodyA,bodyB)
        
        expect(bodyA.exists).to.equal(false);
        expect(bodyA.radius).to.equal(0);
        
        expect(bodyB.exists).to.equal(true);
        expect(bodyB.mass).to.equal(massA + massB);

    });
    
     it('should be commutative', function() {
        var simulation = new Simulation();
        expect(simulation.bodies).to.be.empty;

        var massA = 1;
        var massB = 2;

        var body = {
            mass: massA
        };
        simulation.addBody(body);
        
        body = {
            mass: massB
        };
        simulation.addBody(body);
        
        var bodyA = simulation.bodies[0];
        var bodyB = simulation.bodies[1];
        
        simulation.applyCollision(bodyB,bodyA)
        
        expect(bodyA.exists).to.equal(false);
        expect(bodyA.radius).to.equal(0);
        
        expect(bodyB.exists).to.equal(true);
        expect(bodyB.mass).to.equal(massA + massB);

    });
  });
  
   describe('getAngle', function() {
       
       var simulation = new Simulation();
       var bodyA = new Body();
       var bodyB = new Body();

        beforeEach(function() {
            simulation = new Simulation();
            bodyA = new Body();
            bodyB = new Body();
            simulation.addBody(bodyA);
            simulation.addBody(bodyB);
        });
 
    it('should return angle from one body to another (Quadrant I)', function() {
        bodyA.position = new Vector(0,0);
        bodyB.position = new Vector(1,1);
        expect(simulation.getAngle(bodyA,bodyB)).to.equal(Math.PI/4);
    });
    it('should return angle from one body to another (Quadrant II)', function() {
        bodyA.position = new Vector(0,0);
        bodyB.position = new Vector(-1,1);
        expect(simulation.getAngle(bodyA,bodyB)).to.equal(3 * Math.PI/4);
    });
    it('should return angle from one body to another (Quadrant III)', function() {
        bodyA.position = new Vector(1,1);
        bodyB.position = new Vector(0,0);
        expect(simulation.getAngle(bodyA,bodyB)).to.equal(5 * Math.PI/4);
    });
    it('should return angle from one body to another (Quadrant IV)', function() {
        bodyA.position = new Vector(-1,1);
        bodyB.position = new Vector(0,0);
        expect(simulation.getAngle(bodyA,bodyB)).to.equal(7 * Math.PI/4);
    });
    it('should return angle from one body to another (Right)', function() {
        bodyA.position = new Vector(0,0);
        bodyB.position = new Vector(1,0);
        expect(simulation.getAngle(bodyA,bodyB)).to.equal(0);
    });
    it('should return angle from one body to another (Up)', function() {
        bodyA.position = new Vector(0,0);
        bodyB.position = new Vector(0,1);
        expect(simulation.getAngle(bodyA,bodyB)).to.equal(Math.PI/2);
    });
    it('should return angle from one body to another (Left)', function() {
        bodyA.position = new Vector(1,0);
        bodyB.position = new Vector(0,0);
        expect(simulation.getAngle(bodyA,bodyB)).to.equal(Math.PI);
    });
    it('should return angle from one body to another (Down)', function() {
        bodyA.position = new Vector(0,1);
        bodyB.position = new Vector(0,0);
        expect(simulation.getAngle(bodyA,bodyB)).to.equal(3 * Math.PI/2);
    });
  });
  
  describe('getGravity', function() {
       
       var simulation = new Simulation();
       var massA = 0;
       var massB = 0;
       var distance = 0;

        beforeEach(function() {
            massA = 0;
            massB = 0;
            distance = 0;
        });
 
    it('should return an appropriate force', function() {
        massA = 1;
        massB = 1;
        distance = 1;
        expect(simulation.getGravity(massA,massB,distance)).to.equal(simulation.G);
    });
    
    it('should be commutative', function() {
        massA = 1;
        massB = 2;
        distance = 1;
        expect(simulation.getGravity(massA,massB,distance)).to.equal(simulation.getGravity(massB,massA,distance));
    });
    
    it('should return 0 if distance is 0', function() {
        massA = 1;
        massB = 2;
        distance = 0;
        expect(simulation.getGravity(massA,massB,distance)).to.equal(0);
    });
    
  });
  
  describe('getVector', function() {
       
       var simulation = new Simulation();
       var angle = 0;
       var magnitude = 0;
       var root2over2 = Math.SQRT2/2;

        beforeEach(function() {
            angle = 0;
            magnitude = 0;
        });
 
    it('should return vector of given magnitude in direction of angle (Quadrant I)', function() {
        angle = Math.PI/4;
        magnitude = 1;
        expect(simulation.getVector(angle,magnitude).distanceTo(new Vector(root2over2,root2over2)) <= 0.00000000000001).to.equal(true);
    });
    it('should return vector of given magnitude in direction of angle (Quadrant II)', function() {
        angle = 3 * Math.PI/4;
        magnitude = 1;
        expect(simulation.getVector(angle,magnitude).distanceTo(new Vector(-root2over2,root2over2)) <= 0.00000000000001).to.equal(true);
    });
    it('should return vector of given magnitude in direction of angle (Quadrant III)', function() {
        angle = 5 * Math.PI/4;
        magnitude = 1;
        expect(simulation.getVector(angle,magnitude).distanceTo(new Vector(-root2over2,-root2over2)) <= 0.00000000000001).to.equal(true);
    });
    it('should return vector of given magnitude in direction of angle (Quadrant IV)', function() {
        angle = 7 * Math.PI/4;
        magnitude = 1;
        expect(simulation.getVector(angle,magnitude).distanceTo(new Vector(root2over2,-root2over2)) <= 0.00000000000001).to.equal(true);
    });
    it('should return vector of given magnitude in direction of angle (Right)', function() {
        angle = 0;
        magnitude = 1;
        expect(simulation.getVector(angle,magnitude).distanceTo(new Vector(1,0)) <= 0.00000000000001).to.equal(true);
    });
    it('should return vector of given magnitude in direction of angle (Up)', function() {
        angle = Math.PI/2;
        magnitude = 1;
        expect(simulation.getVector(angle,magnitude).distanceTo(new Vector(0,1)) <= 0.00000000000001).to.equal(true);
    });
    it('should return vector of given magnitude in direction of angle (Left)', function() {
        angle = Math.PI;
        magnitude = 1;
        expect(simulation.getVector(angle,magnitude).distanceTo(new Vector(-1,0)) <= 0.00000000000001).to.equal(true);
    });
    it('should return vector of given magnitude in direction of angle (Down)', function() {
        angle = 3 * Math.PI/2;
        magnitude = 1;
        expect(simulation.getVector(angle,magnitude).distanceTo(new Vector(0,-1)) <= 0.00000000000001).to.equal(true);
    });
    
  });
  
  describe('applyForces', function() {
       
       var simulation = new Simulation();
       var bodyA = new Body();
       var bodyB = new Body();
       var bodyC = new Body();

        beforeEach(function() {
            simulation = new Simulation();
            bodyA = new Body();
            bodyB = new Body();
            bodyC = new Body();
            simulation.addBody(bodyA);
            simulation.addBody(bodyB);
            simulation.addBody(bodyC);
        });
 
    it('should apply accumulated forces', function() {
        
        
        var newBody = new Body();
        newBody.force = new Vector(21,21);
        newBody.applyForce(110000);
        var expectedPosition = newBody.position;
        
        simulation.bodies[0].force = new Vector(21,21);
        simulation.applyForces(110000);
        
        expect(simulation.bodies[0].position.x).to.equal(expectedPosition.x);
        expect(simulation.bodies[0].position.y).to.equal(expectedPosition.y);
    });
    
    it('should accept bodies with false exists flag', function() {
        var newBody = new Body();
        newBody.force = new Vector(21,13);
        newBody.applyForce(11);
        
        var expectedPosition = bodyA.position;
        
        simulation.bodies[0].force = new Vector(21,13);
        simulation.bodies[0].destroy();
        simulation.applyForces(11)
        
        expect(simulation.bodies[0].position.x).to.equal(expectedPosition.x);
        expect(simulation.bodies[0].position.y).to.equal(expectedPosition.y);
    });
    
  });
  
  describe('bigNum', function() {
    it('should return a number given scientific notation', function() {
        var simulation = new Simulation();
        
        var b = 1.2345
        var e = 3
        
        expect(simulation.bigNum(b,e)).to.equal(1234.5);
        
    })
});
  
  describe('update', function() {
       
    it('should be deterministic', function() {
        var simulation = new Simulation();
        simulation.addBody(new Body());
        simulation.addBody(new Body());
        simulation.addBody(new Body());
        
        var simulation2 = new Simulation();
        simulation2.addBody(new Body());
        simulation2.addBody(new Body());
        simulation2.addBody(new Body());
        
        simulation.bodies[0].position = new Vector(10000000000000000000,10000000000000000000);
        simulation2.bodies[0].position = new Vector(10000000000000000000,10000000000000000000);
        
        simulation.bodies[1].position = new Vector(-10000000000000000000,10000000000000000000);
        simulation2.bodies[1].position = new Vector(-10000000000000000000,10000000000000000000);
        
        simulation.bodies[2].position = new Vector(10000000000000000000,-10000000000000000000);
        simulation2.bodies[2].position = new Vector(10000000000000000000,-10000000000000000000);
        
        simulation.update(1000);
        simulation2.update(1000);
        
        simulation.update(1005);
        simulation2.update(1005);
        
        simulation.update(1020);
        simulation2.update(1020);
        
        for(var i = 0; i < 3; i++) {
            expect(simulation.bodies[i].position.x).to.equal(simulation2.bodies[i].position.x);
            expect(simulation.bodies[i].position.y).to.equal(simulation2.bodies[i].position.y);
            
            expect(simulation.bodies[i].velocity.x).to.equal(simulation2.bodies[i].velocity.x);
            expect(simulation.bodies[i].velocity.y).to.equal(simulation2.bodies[i].velocity.y);
        }
        
    });
    
    it('should handle collisions', function() {
        var simulation = new Simulation();
        simulation.addBody({position: {x: 10, y: 0}, radius: 6, mass: 100});
        simulation.addBody({position: {x: 0, y: 0}, radius: 5, mass: 10});

        simulation.update(1);
        
        expect(simulation.bodies[0].exists).to.equal(true);
        expect(simulation.bodies[1].exists).to.equal(false);
        expect(simulation.bodies[0].mass).to.equal(110);
        expect(simulation.bodies[1].radius).to.equal(0);
        
    });
   
    
  });
  
    describe('toString', function() {
        it('should return a string', function() {
            var simulation = new Simulation();
            simulation.addBody({position: {x: 10, y: 0}, radius: 6, mass: 100});
            simulation.addBody({position: {x: 0, y: 0}, radius: 5, mass: 10});

            simulation.update(1);
            
            expect(simulation.toString()).to.be.a('string');

        });
    });
    
    describe('assignIDs', function() {
        
        it('should end with all bodies having number IDs', function() {
            var simulation = new Simulation();
            simulation.bodies = [new Body(),new Body(),new Body(),new Body(),new Body(),new Body()];
            simulation.assignIDs();
            
            simulation.bodies.forEach( function(bodyA) {
                expect(bodyA.id).not.to.equal(NaN);
            });
        });
        
        it('should end with all bodies having unique IDs', function() {
            var simulation = new Simulation();
            simulation.bodies = [new Body(),new Body(),new Body(),new Body(),new Body(),new Body()];
            simulation.assignIDs();
            
            simulation.bodies.forEach( function(bodyA,indexA) {
                simulation.bodies.forEach( function(bodyB,indexB) {
                    if (indexA != indexB) {
                        expect(bodyA.id).not.to.equal(bodyB.id);
                    }
                });
            });
        });
        
        it('should work after deletions', function() {
            var simulation = new Simulation();
            simulation.bodies = [new Body(),new Body(),new Body(),new Body(),new Body(),new Body()];
            simulation.assignIDs();
            simulation.deleteBody(2);
            
            simulation.bodies.forEach( function(bodyA,indexA) {
                simulation.bodies.forEach( function(bodyB,indexB) {
                    if (indexA != indexB) {
                        expect(bodyA.id).not.to.equal(bodyB.id);
                    }
                });
            });
        });
        
    });
  
});


// Simulator.prototype.assignIDs = function() {
//     this.idCounter = 0;
//     this.bodies.forEach(function(body) { 
//         body.id = this.idCounter;
//         this.idCounter += 1;
//     });
// };
