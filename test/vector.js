var _      = require('lodash');
var expect = require('chai').expect;
var Vector = require('../src/vector.js');

describe('Vector', function () {
    var origin = new Vector(0,0);
    var point = new Vector(1,1);

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

        it('should return a new vector', function() {
            expect(origin.add(point) instanceof Vector).to.be.true;
        });
        it('should not modify the existing vectors', function() {
            var value = origin.add(point);
            expect(origin.x).to.equal(0);
            expect(origin.y).to.equal(0);
            expect(point.x).to.equal(1);
            expect(point.y).to.equal(1);
        });
        it('should correctly sum the components', function() {
            var value = point.add(new Vector(-1, -1));
            expect(value.x).to.equal(0);
            expect(value.y).to.equal(0);
        });
        it('should be associative', function() {
            var v1 = origin.add(point);
            var v2 = point.add(origin);

            expect(_.isEqual(v1, v2)).to.be.true;
        });
        it('should have additive identity', function() {
            var value = point.add(identity);
            expect(_.isEqual(value, point)).to.be.true;
        });
    });
});
