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
var Vector = require('../src/vector.js');

describe('Vector', function () {
  var origin = new Vector(0,0);
  var point = new Vector(1,1);

  beforeEach(function() {
    origin = new Vector(0,0);
    point = new Vector(1,1);
  });

  describe('distanceTo', function() {
    it('should return 0 when given the same point', function() {
      expect(origin.distanceTo(origin)).to.equal(0);
    });
    it('should return the correct value', function() {
      expect(origin.distanceTo(point)).to.equal(Math.sqrt(2));
    });
    it('should be associtaive', function() {
      var d1 = origin.distanceTo(point);
      var d2 = point.distanceTo(origin);

      expect(d1).to.equal(d2);
    });
  });
  describe('scalarProduct', function() {
    var identity = 1;

    it('should return a new vector', function() {
      expect(origin.scalarProduct(point) instanceof Vector).to.be.true;
    });
    it('should not modify the existing vector', function() {
      var value = point.scalarProduct(2);
      expect(point.x).to.equal(1);
      expect(point.y).to.equal(1);
    });
    it('should correctly the components', function() {
      var value = point.scalarProduct(2);
      expect(value.x).to.equal(2);
      expect(value.y).to.equal(2);
    });
    it('should have multiplicative identity', function() {
      var value = point.scalarProduct(identity);
      expect(_.isEqual(value, point)).to.be.true;
    });
  });
  describe('add', function() {
    var identity = new Vector(0,0);

    it('should update the vector', function() {
      var value = origin.add(point);
      expect(origin.x).to.equal(1);
      expect(origin.y).to.equal(1);
      expect(point.x).to.equal(1);
      expect(point.y).to.equal(1);
    });
    it('should correctly sum the components', function() {
      point.add(new Vector(-1, -1));
      expect(point.x).to.equal(0);
      expect(point.y).to.equal(0);
    });
    it('should be associative', function() {
      var left = new Vector(0,0);
      var right = new Vector(1,1);

      expect(_.isEqual(left, right)).to.be.false;

      var v1 = left.add(point);
      var v2 = right.add(origin);

      expect(_.isEqual(left, right)).to.be.true;
    });
    it('should have additive identity', function() {
      var original = point;
      point.add(identity);
      expect(_.isEqual(original, point)).to.be.true;
    });
  });
  
  describe('toString', function() {
        it('should return a string', function() {
            var vector = new Vector();
            
            expect(vector.toString()).to.be.a('string');
         
        });
    });
    
    
});
