var _          = require('lodash');
var Body       = require('../src/body.js');
var expect     = require('chai').expect;
var Simulation = require('../src/engine.js');
var Vector     = require('../src/vector.js');

describe('Simulation', function() {
  it('should reset with given bodies', function() {
    var simulation = new Simulation();
    expect(simulation.bodies).to.be.empty;

    var body = {
      mass: 1,
      position: {x: 1, y: 2},
      radius: 1,
      velocity: {x: 3, y: 4}
    };

    simulation.reset([body]);
    expect(simulation.bodies).not.to.be.empty;

    var parsedBody = simulation.bodies[0];
    console.log(parsedBody.position.prototype);
    expect(parsedBody instanceof Body).to.be.true;
    expect(parsedBody.mass).to.equal(body.mass);
    expect(parsedBody.radius).to.equal(body.radius);
    expect(parsedBody.position.x).to.equal(1);
    expect(parsedBody.position.y).to.equal(2);
    expect(parsedBody.velocity.x).to.equal(3);
    expect(parsedBody.velocity.y).to.equal(4);
    expect(parsedBody.density).to.be.a('number');
  });
});
