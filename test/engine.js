var _          = require('lodash');
var Body       = require('../src/body.js');
var expect     = require('chai').expect;
var Simulation = require('../src/engine.js');

describe('Simulation', function() {
  it('should reset with given bodies', function() {
    var simulation = new Simulation();
    expect(simulation.bodies).to.be.empty;

    var body = {
      mass: 1,
      position: {x: 0, y: 0},
      radius: 1,
      velocity: {x: 0, y: 0}
    };

    simulation.reset([body]);
    expect(simulation.bodies).not.to.be.empty;
    expect(simulation.bodies[0] instanceof Body).to.be.true;
  });
});
