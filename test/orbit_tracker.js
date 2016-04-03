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
    
    
});
