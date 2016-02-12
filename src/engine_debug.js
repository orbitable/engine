//var Simulator = require('./engine.js');


var i = 0;

var sim = new Simulator()

sim.printState();


while (i < 10000) {
    sim.update();
	i+=1;
}

sim.printState();

throw new Error();