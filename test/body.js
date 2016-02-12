var _      = require('lodash');
var expect = require('chai').expect;
var Body   = require('../src/body.js');
var Vector = require('../src/vector.js');

describe('Body', function() {
    it('should accumulate a force on addForce', function() {
        var body = new Body();
        var force = new Vector(1,1);

        body.addForce(force);
        expect(_.isEqual(body.force, force)).to.be.true;
        
        body.addForce(force);
        expect(_.isEqual(body.force, force.scalarProduct(2))).to.be.true;
    });
});
