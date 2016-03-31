var _      = require('lodash');
var expect = require('chai').expect;
var Body = require('../src/body.js');
var OrbitTracker = require('../src/orbit_tracker.js');

describe('OrbitTracker', function () {
  
//   describe('addAngle', function() {
//         it('should add correctly', function() {
//             var o = new OrbitTracker(new Body(),new Body(), 0);
            
//             expect( Math.abs(o.addAngle(0.1        ,0.2) - 0.3)           < 0.000000001 ).to.equal(true);
//             expect( Math.abs(o.addAngle(o.PI2 - 0.1,0.2) - 0.1)           < 0.000000001 ).to.equal(true);
//             expect( Math.abs(o.addAngle(o.PI2 - 0.2,0.1) - (o.PI2 - 0.1)) < 0.000000001 ).to.equal(true);
            
//             expect( Math.abs(o.addAngle(0.1,-0.2) - (o.PI2-0.1)) < 0.000000001 ).to.equal(true);
//             expect( Math.abs(o.addAngle(0.2,-0.1) - 0.1)         < 0.000000001 ).to.equal(true);
            
//             // expect( Math.abs(o.addAngle(0.0,0.1) - 0.1)         < 0.000000001 ).to.equal(true);
//             // expect( Math.abs(o.addAngle(0.0,-0.1) - (-0.1))         < 0.000000001 ).to.equal(true);
//             // expect( Math.abs(o.addAngle(o.PI2,0.1) - 0.1)         < 0.000000001 ).to.equal(true);
//             // expect( Math.abs(o.addAngle(o.PI2,-0.1) - (-0.1))        < 0.000000001 ).to.equal(true);
         
//         });
//     });
    
    // describe('deltaAngle', function() {
    //     it('should return gap from a to b', function() {
    //         var o = new OrbitTracker(new Body(),new Body(), 0);
            
    //         expect( Math.abs(o.deltaAngle(0.0,0.1) - 0.1)         < 0.000000001 ).to.equal(true);
    //         expect( Math.abs(o.deltaAngle(0.0,-0.1) - (-0.1))         < 0.000000001 ).to.equal(true);
    //         expect( Math.abs(o.deltaAngle(o.PI2,0.1) - 0.1)         < 0.000000001 ).to.equal(true);
    //         expect( Math.abs(o.deltaAngle(o.PI2,-0.1) - (-0.1))        < 0.000000001 ).to.equal(true);
         
    //     });
    // });
    
    describe('getAngularVelocity', function() {
        it('should return angular distance between two angles', function() {
            
            expect(OrbitTracker.getAngularVelocity(0.1,0.3)).to.be.within(0.199,0.211);
            expect(OrbitTracker.getAngularVelocity(0.3,0.1)).to.be.within(-0.211,-0.199);
            expect(OrbitTracker.getAngularVelocity(Math.PI * 2 - 0.1,0.1)).to.be.within(0.199,0.211);
            expect(OrbitTracker.getAngularVelocity(0.1,Math.PI * 2 - 0.1)).to.be.within(-0.211,-0.199);
            
            expect(OrbitTracker.getAngularVelocity(Math.PI * 2 - 0.1,0)).to.be.within(0.099,0.111);
            expect(OrbitTracker.getAngularVelocity(0.1,0)).to.be.within(-0.111,-0.099);
            expect(OrbitTracker.getAngularVelocity(0,0.1)).to.be.within(0.099,0.111);
            expect(OrbitTracker.getAngularVelocity(0,Math.PI * 2 - 0.1)).to.be.within(-0.111,-0.099);
            
            expect(OrbitTracker.getAngularVelocity(0.1,0.1)).to.be.within(-0.01,0.01);
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
