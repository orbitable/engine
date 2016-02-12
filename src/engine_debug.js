var Simulator = require('./engine.js');


var i = 0;

var sim = new Simulator()

while (i < 10) {
	sim.update();
	i+=1;
}