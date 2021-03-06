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

var _      = require('lodash');
var expect = require('chai').expect;
var Body   = require('../src/body.js');
var Vector = require('../src/vector.js');

describe('Body', function() {
    
    it('should assign a random name',function() {
        var body = new Body(1,new Vector(2,3),new Vector(4,5),6,7,"Name","white");
        expect(body.name).to.be.a('string');
        
    });
    
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
    
    describe('update', function() {
        var b = new Body();
        var modifier = {};
        
        beforeEach( function() {
            b = new Body(1,new Vector(1,1),new Vector(1,1),1,1);
            modifier = {
                mass: 2,
                position: {x: 2, y: 2},
                velocity: {x: 2, y: 2},
                radius: 2,
                luminosity: 2
            };
        });
        
        
        it('should be able to update all constructor attributes', function() {
            b.update(modifier);
            
            expect(b.mass).to.equal(2);
            expect(b.position.x).to.equal(2);
            expect(b.position.y).to.equal(2);
            expect(b.velocity.x).to.equal(2);
            expect(b.velocity.y).to.equal(2);
            expect(b.radius).to.equal(2);
            expect(b.luminosity).to.equal(2);
        });
        
        it('should be able to update only mass', function() {
            modifier = {mass: 2};
            b.update(modifier);
            
            expect(b.mass).to.equal(2);
            expect(b.position.x).to.equal(1);
            expect(b.position.y).to.equal(1);
            expect(b.velocity.x).to.equal(1);
            expect(b.velocity.y).to.equal(1);
            expect(b.radius).to.equal(1);
            expect(b.luminosity).to.equal(1);
        });
        
        it('should be able to update only x position attribute', function() {
            modifier = {position: {x: 2}};
            b.update(modifier);
            
            expect(b.mass).to.equal(1);
            expect(b.position.x).to.equal(2);
            expect(b.position.y).to.equal(1);
            expect(b.velocity.x).to.equal(1);
            expect(b.velocity.y).to.equal(1);
            expect(b.radius).to.equal(1);
            expect(b.luminosity).to.equal(1);
        });

        it('should parse position as a float', function() {
          var position = {position: {x: "23.2"}};

          b.update(position);
          expect(b.position.x).to.equal(23.2);
        });

        it('should parse velocity as a string', function() {
          var velocity = {velocity: {x: "-100.232"}};

          b.update(velocity);
          expect(b.velocity.x).to.equal(-100.232);
        });

        it('retain previous value when given value is not numeric', function() {
          var velocity = {velocity: {x: "not a number"}};

          b.update(velocity);
          expect(b.velocity.x).to.equal(1);
        });

        it('should allow you to zero a value', function() {
            var velocity = {velocity: {x: "0", y: "0"}};

            b.update(velocity);
            expect(b.velocity.x).to.equal(0);
            expect(b.velocity.y).to.equal(0);
        });
        
        it('should be able to update only y position attribute', function() {
            modifier = {position: {y: 2}};
            b.update(modifier);
            
            expect(b.mass).to.equal(1);
            expect(b.position.x).to.equal(1);
            expect(b.position.y).to.equal(2);
            expect(b.velocity.x).to.equal(1);
            expect(b.velocity.y).to.equal(1);
            expect(b.radius).to.equal(1);
            expect(b.luminosity).to.equal(1);
        });
        
        it('should be able to update only x velocity attribute', function() {
            modifier = {velocity: {x: 2}};
            b.update(modifier);
            
            expect(b.mass).to.equal(1);
            expect(b.position.x).to.equal(1);
            expect(b.position.y).to.equal(1);
            expect(b.velocity.x).to.equal(2);
            expect(b.velocity.y).to.equal(1);
            expect(b.radius).to.equal(1);
            expect(b.luminosity).to.equal(1);
        });
        
        it('should be able to update only y velocity attribute', function() {
            modifier = {velocity: {y: 2}};
            b.update(modifier);
            
            expect(b.mass).to.equal(1);
            expect(b.position.x).to.equal(1);
            expect(b.position.y).to.equal(1);
            expect(b.velocity.x).to.equal(1);
            expect(b.velocity.y).to.equal(2);
            expect(b.radius).to.equal(1);
            expect(b.luminosity).to.equal(1);
        });
        
        it('should be able to update only luminosity attribute', function() {
            modifier = {luminosity: 2};
            b.update(modifier);
            
            expect(b.mass).to.equal(1);
            expect(b.position.x).to.equal(1);
            expect(b.position.y).to.equal(1);
            expect(b.velocity.x).to.equal(1);
            expect(b.velocity.y).to.equal(1);
            expect(b.radius).to.equal(1);
            expect(b.luminosity).to.equal(2);
        });
        
        it('should set luminosity to 0 if cant be parsed', function() {
            modifier = {luminosity: "not a number"};
            b.update(modifier);
            
            expect(b.mass).to.equal(1);
            expect(b.position.x).to.equal(1);
            expect(b.position.y).to.equal(1);
            expect(b.velocity.x).to.equal(1);
            expect(b.velocity.y).to.equal(1);
            expect(b.radius).to.equal(1);
            expect(b.luminosity).to.equal(0);
        });
        
        
        it('should be able to update only radius attribute', function() {
            modifier = {radius: 2};
            b.update(modifier);
            
            expect(b.mass).to.equal(1);
            expect(b.position.x).to.equal(1);
            expect(b.position.y).to.equal(1);
            expect(b.velocity.x).to.equal(1);
            expect(b.velocity.y).to.equal(1);
            expect(b.radius).to.equal(2);
            expect(b.luminosity).to.equal(1);
        });
        
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
    
  describe('copy', function () {
    it('should return an exact copy', function() {
      var b = new Body(1,new Vector(2,3),new Vector(4,5),6,7,"Name","white");
      var c = b.copy();
      expect(c.mass ).to.equal(1);
      expect(c.radius  ).to.equal(6);
      expect(c.luminosity     ).to.equal(7);
      expect(c.name      ).to.equal("Name");
      expect(c.color      ).to.equal("white");
      expect(c.position.x).to.equal(2);
      expect(c.position.y).to.equal(3);
      expect(c.velocity.x).to.equal(4);
      expect(c.velocity.y).to.equal(5);
    });
  });
    
    describe('toString', function() {
        it('should return a string', function() {
            var body = new Body();
            
            expect(body.toString()).to.be.a('string');
         
        });
    });
    
    describe('getColor', function() {
        it('should return appropriate color', function() {
            var body = new Body();
            
            expect(body.generateColor(0,601)).to.be.a('string');
            expect(body.generateColor(0,501)).to.be.a('string');
            expect(body.generateColor(0,401)).to.be.a('string');
            expect(body.generateColor(0,301)).to.be.a('string');
            expect(body.generateColor(0,201)).to.be.a('string');
            expect(body.generateColor(0,101)).to.be.a('string');
            expect(body.generateColor(0,  1)).to.be.a('string');
            
            expect(body.generateColor(1800,1,6.96*Math.pow(10,8))).to.equal('#1a1aff');
            expect(body.generateColor(48.7,1,6.96*Math.pow(10,8))).to.equal('#80d4ff');
            expect(body.generateColor(4.26,1,6.96*Math.pow(10,8))).to.equal('#ffffff');
            expect(body.generateColor(1.65,1,6.96*Math.pow(10,8))).to.equal('#ffff80');
            expect(body.generateColor(.94,1,6.96*Math.pow(10,8))).to.equal('#ffff1a');
            expect(body.generateColor(.31,1,6.96*Math.pow(10,8))).to.equal('#ff6600');
            expect(body.generateColor(.025,1,6.96*Math.pow(10,8))).to.equal('#ff0000');
            
         
        });
    });
    
});
