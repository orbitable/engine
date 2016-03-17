/* Copyright 2016 Orbitable Team Members
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use
 * this file except in compliance with the License.  You may obtain a copy of the
 * License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed
 * under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations under the License.
 */

var Vector = require('./vector.js');
var PlanetNamer = require('./planetNamer.js');

/**
 * Constucts a new rigid body to include in a simluation system.
 *
 * @constructor
 * @param {int}  mass       - The initial unit mass of body
 * @param {Vector} postion    - The initial position of the body
 * @param {Vector} velocity   - The initial unit velocity of the body
 * @param {int}  radius     - The initial unit radius of the body
 * @param {int}  density    - The initial unit density of the body
 * @param {int}  luminosity - The initial unit luminosity of the body
 */

function Body(mass, position, velocity, radius, luminosity, name) {
    this.name = name || new PlanetNamer().getName();
    this.force = new Vector(0,0);
    this.setMassRadius(mass || 5.972 * Math.pow(10,24), radius || 6.3674447 * Math.pow(10,6))
    this.position = position || new Vector(0,0);
    this.velocity = velocity || new Vector(0,0);
    this.luminosity = luminosity || 0;
    this.exists = true;
    this.id = -1
}

Body.prototype = {

    /**
     * Adds mass to the body.
     *
     * @param {int} mass - The mass to add
     */
    addMass: function(mass) {
        this.setMass(this.mass + mass);
    },
    /**
     * Applies an additional force to the body.
     *
     * @param {Vector} force - The force vector to apply
     */
    addForce: function(force) {
        this.force.add(force);
    },

    /**
     * Resets force
     */
    resetForce: function() {
        this.force.x = 0;
        this.force.y = 0;
    },
    /**
     * Updates the position and force for a given interval of time.
     * @param {int} dt - The change in time
     */
    applyForce: function(dt) {
        // this.force = this.force.scalarProduct(dt/this.mass);
        // this.postion = this.position.add(this.force.scalarProduct(dt));

        this.velocity.x += (this.force.x/this.mass)*dt;
        this.velocity.y += (this.force.y/this.mass)*dt;
        this.position.x += this.velocity.x * dt;
        this.position.y += this.velocity.y * dt;

        this.resetForce();
    },

    /**
     * Updates the body's radius. Updates the density accordingly.
     * @param {int} radius - The new radius
     */
    setRadius: function(radius) {
        this.radius = radius;
        this.density = this.mass / ((4/3 * Math.PI) * Math.pow(this.radius, 3));
    },
    /**
     * Updates the body's mass. Updates the radius accordingly.
     * @param {int} mass - The new mass
     */
    setMass: function(mass) {

        if (this.density === 0) {
            this.destroy();
        }
        else {
            this.mass = mass;
            this.radius = 0.62035049090 * Math.pow((this.mass/this.density),(1/3));
        }

    },
    /**
     * Updates the body's mass and radius. Updates the density accordingly.
     * @param {int} mass - The new mass
     * @param {int} radius - The new radius
     */
    setMassRadius: function(mass,radius) {
        this.mass = mass;
        this.radius = radius;
        this.density = this.mass / ((4/3 * Math.PI) * Math.pow(this.radius, 3));
    },
    /**
     * Returns body info in string form
     *
     */
    toString: function() {
        return " ID: " + this.id +
        " E: " + this.exists + 
        " P: " + this.position.toString() + 
        " V: " + this.velocity.toString() + 
        " M: " + this.mass + 
        " R: " + this.radius +
        " D: " + this.density +
        " L: " + this.luminosity;
    },
    /**
     * Sets exists flag to false and sets physical attributes to 0
     */
    destroy: function() {
        this.radius = 0;
        this.exists = false;
    }
};

module.exports = Body;
