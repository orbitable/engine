var _          = require('lodash');
var Body       = require('../src/body.js');
var expect     = require('chai').expect;
var Simulation = require('../src/engine.js');
var Vector     = require('../src/vector.js');

describe('Simulation', function() {
    describe('reset', function() {
  it('should reset with given bodies', function() {
    var simulation = new Simulation();
    expect(simulation.bodies).to.be.empty;

    var body = {
      mass: 1,
      position: {x: 1, y: 2},
      radius: 1,
      velocity: {x: 3, y: 4},
      luminosity: 1234
    };

    simulation.reset([body]);
    expect(simulation.bodies).not.to.be.empty;

    var parsedBody = simulation.bodies[0];
    expect(parsedBody instanceof Body).to.be.true;
    expect(parsedBody.mass).to.equal(body.mass);
    expect(parsedBody.radius).to.equal(body.radius);
    expect(parsedBody.position.x).to.equal(1);
    expect(parsedBody.position.y).to.equal(2);
    expect(parsedBody.velocity.x).to.equal(3);
    expect(parsedBody.velocity.y).to.equal(4);
    expect(parsedBody.density).to.be.a('number');
    expect(parsedBody.luminosity).to.equal(1234);
  });
    });
  
  describe('addBody', function() {
  it('should add given body', function() {
    var simulation = new Simulation();
    expect(simulation.bodies).to.be.empty;

    var body = {
      mass: 1,
      position: {x: 1, y: 2},
      radius: 1,
      velocity: {x: 3, y: 4},
      luminosity: 1234
    };

    simulation.addBody(body);
    expect(simulation.bodies).not.to.be.empty;

    var parsedBody = simulation.bodies[0];
    expect(parsedBody instanceof Body).to.be.true;
    expect(parsedBody.mass).to.equal(body.mass);
    expect(parsedBody.radius).to.equal(body.radius);
    expect(parsedBody.position.x).to.equal(1);
    expect(parsedBody.position.y).to.equal(2);
    expect(parsedBody.velocity.x).to.equal(3);
    expect(parsedBody.velocity.y).to.equal(4);
    expect(parsedBody.density).to.be.a('number');
    expect(parsedBody.luminosity).to.equal(1234);
  });
  
    it('should add given body with only position', function() {
    var simulation = new Simulation();
    expect(simulation.bodies).to.be.empty;

    var body = {
      position: {x: 1, y: 2},
    };

    simulation.addBody(body);
    expect(simulation.bodies).not.to.be.empty;

    var parsedBody = simulation.bodies[0];
    expect(parsedBody instanceof Body).to.be.true;
    expect(parsedBody.mass).to.be.a('number');
    expect(parsedBody.radius).to.be.a('number');
    expect(parsedBody.position.x).to.equal(1);
    expect(parsedBody.position.y).to.equal(2);
    expect(parsedBody.velocity.x).to.be.a('number');
    expect(parsedBody.velocity.y).to.be.a('number');
    expect(parsedBody.density).to.be.a('number');
    expect(parsedBody.luminosity).to.be.a('number');
  });
  });
  
  describe('deleteBody', function() {
  it('should delete bodies with given ID', function() {
    var simulation = new Simulation();
    expect(simulation.bodies).to.be.empty;

    var body = {
      mass: 1,
      position: {x: 1, y: 2},
      radius: 1,
      velocity: {x: 3, y: 4},
      luminosity: 1234
    };

    simulation.addBody(body);
    expect(simulation.bodies).not.to.be.empty;

    var parsedBody = simulation.bodies[0];
    var parsedID = parsedBody.id;
    
    expect(parsedBody instanceof Body).to.be.true;
    
    simulation.deleteBody(parsedID+1);
    expect(simulation.bodies).not.to.be.empty;
    
    simulation.deleteBody(parsedID);
    expect(simulation.bodies).to.be.empty;

  });
  });
  
});
