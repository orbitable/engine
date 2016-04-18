var _      = require('lodash');
var expect = require('chai').expect;
var Body = require('../src/body.js');
var Vector = require('../src/vector.js');
var OrbitTracker = require('../src/orbit_tracker.js');

describe('OrbitTracker', function () {
  
    describe('getAngle', function() {
        it('should return angle between two points', function() {
            
            // 8 vectors forming a square around origin
            var vectors = [
                new Vector( 1, 0),
                new Vector( 1, 1),
                new Vector( 0, 1),
                new Vector(-1, 1),
                new Vector(-1, 0),
                new Vector(-1,-1),
                new Vector( 0,-1),
                new Vector( 1,-1)
            ];
            
            // Direction from origin to vectors[x] = (PI/4) * expects[x]
            var expects = [0,1,2,3,4,5,6,7];
            
            vectors.forEach( function(vector,index) {
                expect(OrbitTracker.getAngle(new Vector(0,0),vector)).to.be.equal(expects[index] * (Math.PI/4));
            });
        
            // Direction from vectors[x] to origin = (PI/4) * expects[x]
            expects = [4,5,6,7,0,1,2,3];
            
            vectors.forEach( function(vector,index) {
                expect(OrbitTracker.getAngle(vector,new Vector(0,0))).to.be.equal(expects[index] * (Math.PI/4));
            });
            
        });
    });
    
    describe('getStartQuads', function() {
        it('should set appropriate start and goal quadrants', function() {
            
            var o = new OrbitTracker(new Body(1,new Vector(1,1)), new Body(1,new Vector(0,0)), 0);
            expect(o.startQuad).to.equal(1);
            expect(o.goalQuad ).to.equal(3);
            
            o = new OrbitTracker(new Body(1,new Vector(-1,1)), new Body(1,new Vector(0,0)), 0);
            expect(o.startQuad).to.equal(2);
            expect(o.goalQuad ).to.equal(4);
            
            o = new OrbitTracker(new Body(1,new Vector(-1,-1)), new Body(1,new Vector(0,0)), 0);
            expect(o.startQuad).to.equal(3);
            expect(o.goalQuad ).to.equal(1);
            
            o = new OrbitTracker(new Body(1,new Vector(1,-1)), new Body(1,new Vector(0,0)), 0);
            expect(o.startQuad).to.equal(4);
            expect(o.goalQuad ).to.equal(2);
            
        });
    });
    
    describe('setState', function() {
        it('should set running state to given value', function() {
            
            var o = new OrbitTracker(new Body(1,new Vector(1,1)), new Body(1,new Vector(0,0)), 0);
            o.setState(true,100);
            expect(o.running).to.equal(true);
            
            o.setState(false,100);
            expect(o.running).to.equal(false);
        });
    });
    
    describe('setCenterBody', function() {
        it('should set centerBody to given value', function() {
            center = new Body();
            var o = new OrbitTracker(new Body(1,new Vector(1,1)), new Body(1,new Vector(0,0)), 0);
            o.setCenterBody(center);
            expect(o.centerBody).to.equal(center);
        });
    });
    
    describe('setTargetBody', function() {
        it('should set targetBody to given value', function() {
            target = new Body();
            var o = new OrbitTracker(new Body(1,new Vector(1,1)), new Body(1,new Vector(0,0)), 0);
            o.setTargetBody(target);
            expect(o.targetBody).to.equal(target);
        });
    });
    
    describe('checkFull', function() {
        it('should complete orbit if startAngle is crossed', function() {
            var o = new OrbitTracker(new Body(1,new Vector(1,1)), new Body(1,new Vector(0,0)), 0);
            o.lastAngle = 0.1;
            o.startAngle = 0.2;
            o.currentAngle = 0.3;
            o.semiComplete = true;
            o.checkFull(100);
            expect(o.orbitCount).to.equal(1); 
        });
    });
    describe('checkSemi', function() {
        it('should complete orbit if startAngle is crossed', function() {
            var o = new OrbitTracker(new Body(1,new Vector(1,1)), new Body(1,new Vector(0,0)), 0);
            o.semiComplete = false;
            o.targetBody.position = new Vector(-1,-1);
            o.checkSemi();
            expect(o.semiComplete).to.equal(true);  
        });
    });
    describe('update', function() {
        it('should check for appropriate state', function() {
            var o = new OrbitTracker(new Body(1,new Vector(1,1)), new Body(1,new Vector(0,0)), 0);
            o.lastAngle = 0.1;
            o.startAngle = 0.2;
            o.targetBody.position = new Vector(0,1);
            o.setState(true,0);
            o.semiComplete = true;
            o.update(100);
            expect(o.orbitCount).to.equal(1);

            o = new OrbitTracker(new Body(1,new Vector(1,1)), new Body(1,new Vector(0,0)), 0);
            o.setState(true,0);
            o.semiComplete = false;
            o.targetBody.position = new Vector(-1,-1);
            o.update(100);
            expect(o.semiComplete).to.equal(true);  
        });
        it('should abort if centerBody is null', function() {
            var o = new OrbitTracker(new Body(1,new Vector(1,1)), new Body(1,new Vector(0,0)), 0);
            o.centerBody = null;
            o.setState(true,1000);
            o.update(1000);
            expect(o.running).to.equal(false);
        });
        it('should abort if targetBody is null', function() {
            var o = new OrbitTracker(new Body(1,new Vector(1,1)), new Body(1,new Vector(0,0)), 0);
            o.targetBody = null;
            o.setState(true,1000);
            o.update(1000);
            expect(o.running).to.equal(false);
        });
    });
    
    describe('completeOrbit', function() {
        it('should increment orbit count by 1', function() {
            var o = new OrbitTracker(new Body(1,new Vector(1,1)), new Body(1,new Vector(0,0)), 0);
            o.completeOrbit(100);
            expect(o.orbitCount).to.equal(1);
        });
        it('should calculate average of all orbits', function() {
            var o = new OrbitTracker(new Body(1,new Vector(1,1)), new Body(1,new Vector(0,0)), 0);
            o.completeOrbit(100);
            expect(o.orbitTime).to.equal(100);
            o.completeOrbit(300);
            expect(o.orbitTime).to.equal(150);
            o.completeOrbit(600);
            expect(o.orbitTime).to.equal(200);
        });
        it('should keep track of min and max times', function() {
            var o = new OrbitTracker(new Body(1,new Vector(1,1)), new Body(1,new Vector(0,0)), 0);
            o.completeOrbit(300);
            o.completeOrbit(400);
            o.completeOrbit(600);
            o.completeOrbit(1000);
            o.completeOrbit(1200);
            expect(o.minTime).to.equal(100);
            expect(o.maxTime).to.equal(400);
        });
        it('should reset startTime to given time', function() {
            var o = new OrbitTracker(new Body(1,new Vector(1,1)), new Body(1,new Vector(0,0)), 0);
            o.completeOrbit(300);
            o.completeOrbit(400);
            o.completeOrbit(600);
            o.completeOrbit(1000);
            o.completeOrbit(1200);
            expect(o.startTime).to.equal(1200);
        });
    });
    
    
    describe('checkCross', function() {
        it('should return angular distance between two angles', function() {
            
            expect(OrbitTracker.checkCross(0.1,0.3,0.2)).to.be.equal(true)
            expect(OrbitTracker.checkCross(0.1,0.3,0.1)).to.be.equal(true)
            expect(OrbitTracker.checkCross(0.1,0.3,0.3)).to.be.equal(true)
            expect(OrbitTracker.checkCross(0.1,0.3,0.4)).to.be.equal(false)
            expect(OrbitTracker.checkCross(0.1,0.3,0.05)).to.be.equal(false)
            
            expect(OrbitTracker.checkCross(0.3,0.1,0.2)).to.be.equal(true);
            expect(OrbitTracker.checkCross(0.3,0.1,0.4)).to.be.equal(false);
            expect(OrbitTracker.checkCross(0.3,0.1,0.05)).to.be.equal(false);
            
            expect(OrbitTracker.checkCross(Math.PI * 2 - 0.1,0.1,0.0)).to.be.equal(true);
            expect(OrbitTracker.checkCross(Math.PI * 2 - 0.1,0.1,0.2)).to.be.equal(false);
            expect(OrbitTracker.checkCross(Math.PI * 2 - 0.1,0.1,Math.PI * 2 - 0.2)).to.be.equal(false);

            expect(OrbitTracker.checkCross(0.1,Math.PI * 2 - 0.1,0.0)).to.be.equal(true);
            expect(OrbitTracker.checkCross(0.1,Math.PI * 2 - 0.1,0.2)).to.be.equal(false);
            expect(OrbitTracker.checkCross(0.1,Math.PI * 2 - 0.1,Math.PI * 2 - 0.2)).to.be.equal(false);
            
            expect(OrbitTracker.checkCross(0.0,0.0,0.0)).to.be.equal(true);
            expect(OrbitTracker.checkCross(0.0,0.0,0.1)).to.be.equal(false);
            expect(OrbitTracker.checkCross(0.0,0.0,Math.PI * 2 - 0.1)).to.be.equal(false);
            
        });
    });
    
    describe('toString', function() {
        it('should return a string', function() {
            var o = new OrbitTracker(new Body(1,new Vector(1,1)), new Body(1,new Vector(0,0)), 0);
            
            expect(o.toString()).to.be.a('string');
         
        });
    });
    
    
});
