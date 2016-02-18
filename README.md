# Engine

> A N-Body simulation library

A library responsible for modeling the gravitational interaction of bodies within
a 2D space. 

## Simulator API

* Bodies data is accessed through Simulator.bodies
* Simulator does not run on its own, it runs step by step as update is called
  * This is why there is no “pause” function. To pause, just stop calling update().

### Body Attributes
* position ( x, y)
* velocity ( x, y)
* mass
* density
* radius
* luminosity

### Simulator Constructor
* Simulator(bodies)
  * bodies should be an array of bodies, likely loaded from another source.
* Simulator()
  * loads the default simulator state (default state TBD)

### Simulator Functions
* update(dT)
  * Simulator calculates the next step of the simulation, updates Simulator.bodies
  * Call with a dT time-step to set the interval for this frame in simulation time
* reset()
  * Restores initial state (same state passed in constructor )
* resume()
  * This tells the simulator to ignore the time passed since the last update. 
  * This should be called immediately before update() after the simulator has been paused
* printState()
  * Prints a (hopefully) neat log of the simulator’s current state to the JavaScript console
* startRecording()
  * Saves current state as starting point
  * Sets flag that tells simulator to record each dT
* stopRecording()
  * Sets flag that tells simulator to stop recording dT
* getRecording()
  * TBD


