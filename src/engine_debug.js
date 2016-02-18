//var Simulator = require('./engine.js');


var i = 0;
var x = 0;

var sim = new Simulator()

sim.printState();

while (x < 10) {

	i = 0;

	while (i < 10) {
	    sim.update(0.05);
		i+=1;
	}
	x+=1;

	sim.printState();
}




throw new Error("Complete");