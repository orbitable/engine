var _      = require('lodash');
var expect = require('chai').expect;
var Body   = require('../src/body.js');
var Vector = require('../src/vector.js');

describe('Body', function() {
    
    it('should allow physical attributes to be assigned',function() {
        var body = new Body(1,new Vector(2,3),new Vector(4,5),6,7);
        expect(body.mass).to.equal(1);
        expect(body.position.x).to.equal(2);
        expect(body.position.y).to.equal(3);
        expect(body.velocity.x).to.equal(4);
        expect(body.velocity.y).to.equal(5);
        expect(body.radius).to.equal(6);
        expect(body.luminosity).to.equal(7);
        
    });
    
    it('should allow physical attributes to be left unassigned',function() {
        var body = new Body();
        expect(body.mass).not.to.equal(null);
        expect(body.position.x).not.to.equal(null);
        expect(body.position.y).not.to.equal(null);
        expect(body.velocity.x).not.to.equal(null);
        expect(body.velocity.y).not.to.equal(null);
        expect(body.radius).not.to.equal(null);
        expect(body.luminosity).not.to.equal(null);
        
    });
    
    describe('addForce', function() {
        it('should accumulate a force', function() {
            var body = new Body();
            var force = new Vector(1,1);

            body.addForce(force);
            expect(_.isEqual(body.force, force)).to.be.true;
            
            body.addForce(force);
            expect(_.isEqual(body.force, force.scalarProduct(2))).to.be.true;
        });
    });
    
    describe('resetForce', function() {
        it('should set force to zero', function() {
            var body = new Body();
            var force = new Vector(1,1);

            body.addForce(force);
            expect(_.isEqual(body.force, force)).to.be.true;
            
            body.resetForce();
            expect(_.isEqual(body.force, new Vector(0,0))).to.be.true;
        });
    });
    
    describe('applyForce', function() {
        it('should set velocity and position based on force', function() {
            var mass = 5;
            var body = new Body(mass);
            var force = new Vector(3,2);
            var dT = 10

            body.addForce(force);
            expect(_.isEqual(body.force, force)).to.be.true;
            
            body.applyForce(dT);
            expect(_.isEqual(body.velocity.x, force.x * dT / mass)).to.be.true;
            expect(_.isEqual(body.velocity.y, force.y * dT / mass)).to.be.true;
            
            
            expect(_.isEqual(body.position.x, force.x * dT * dT / mass)).to.be.true;
            expect(_.isEqual(body.position.y, force.y * dT * dT / mass)).to.be.true;
            
        });
    });
    
    describe('setMass', function() {
        it('should set mass, then set radius according to new mass/density', function() {
            var mass = 10;
            var radius = 10;
            var density = 10;
            var body = new Body();
            
            var newMass = 100;
            
            body.mass = mass;
            body.radius = radius;
            body.density = density;

            body.setMass(newMass);
            expect(_.isEqual(body.mass,newMass)).to.be.true;
            expect(_.isEqual(body.radius, 0.62035049090 * Math.pow((newMass/density),(1/3)))).to.be.true;
            
        });
        
        it('should destroy body if density is 0', function() {
            var mass = 10;
            var radius = 10;
            var density = 0;
            var body = new Body();
            
            var newMass = 100;
            
            body.mass = mass;
            body.radius = radius;
            body.density = density;

            body.setMass(newMass);
            expect(body.mass).not.to.equal(newMass);
            expect(_.isEqual(body.radius, 0.62035049090 * Math.pow((newMass/density),(1/3)))).to.be.false;
            expect(_.isEqual(body.exists)).to.be.false;
            
        });
        
    });
    
    describe('addMass', function() {
        it('should add mass, then set radius according to new mass/density', function() {
            var mass = 10;
            var radius = 10;
            var density = 10;
            var body = new Body();
            
            var moreMass = 100;
            
            body.mass = mass;
            body.radius = radius;
            body.density = density;

            body.addMass(moreMass);
            expect(_.isEqual(body.mass,mass + moreMass)).to.be.true;
            expect(_.isEqual(body.radius, 0.62035049090 * Math.pow(((mass + moreMass)/density),(1/3)))).to.be.true;
            
        });
    });
    
    describe('setRadius', function() {
        it('should set mass and radius, then set density accordingly', function() {
            var mass = 10;
            var radius = 10;
            var density = 10;
            var body = new Body();
            
            var newRadius = 100;
            
            body.mass = mass;
            body.radius = radius;
            body.density = density;

            body.setRadius(newRadius);
            expect(_.isEqual(body.radius,newRadius)).to.be.true;
            expect(_.isEqual(body.density,   mass / ((4/3 * Math.PI) * Math.pow(newRadius, 3))   )).to.be.true;
            
        });
    });
    
    describe('setMassRadius', function() {
        it('should set mass and radius, then set density accordingly', function() {
            var mass = 10;
            var radius = 10;
            var density = 10;
            var body = new Body();
            
            var newMass = 100;
            var newRadius = 100;
            
            body.mass = mass;
            body.radius = radius;
            body.density = density;

            body.setMassRadius(newMass,newRadius);
            expect(_.isEqual(body.mass,newMass)).to.be.true;
            expect(_.isEqual(body.radius,newRadius)).to.be.true;
            expect(_.isEqual(body.density,   newMass / ((4/3 * Math.PI) * Math.pow(newRadius, 3))   )).to.be.true;
            
        });
    });
    
    describe('destroy', function() {
        it('should set exists flag to false and radius to 0', function() {
            var radius = 10;
            var body = new Body();
            body.radius = radius;

            body.destroy();
            expect(body.radius).to.equal(0);
            expect(body.exists).to.equal(false);
         
        });
    });
    
    describe('toString', function() {
        it('should return a string', function() {
            var body = new Body();
            
            expect(body.toString()).to.be.a('string');
         
        });
    });
    
});
