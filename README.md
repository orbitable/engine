# Engine

> A N-Body simulation library

A library responsible for modeling the gravitational interaction of bodies within
a 2D space. 

## Simulator API

* Bodies data is accessed through Simulator.bodies
* Repeatedly pass a timestep to update() to run the simulator


### Body Attributes
Constructor: Body(mass, position, velocity, radius, luminosity, name, color)
* position ( x, y)
* velocity ( x, y)
* mass
* radius
* luminosity
* color
* exists

### Simulator Functions
* update(dT)
  * Simulator calculates the next step of the simulation, updates Simulator.bodies
  * Call with a dT time-step to set the interval for this frame in simulation time
* reset(bodies)
  * Restores simulation to given state
* printState()
  * Prints a (hopefully) neat log of the simulator’s current state to the JavaScript console


