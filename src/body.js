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
var _ = require('lodash');

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

function Body(mass, position, velocity, radius, luminosity, name, color) {
    this.name = name || new PlanetNamer().getName();
    this.force = new Vector(0,0);
    this.setMassRadius(mass || 5.972 * Math.pow(10,24), radius || 6.3674447 * Math.pow(10,6))
    this.position = position || new Vector(0,0);
    this.velocity = velocity || new Vector(0,0);
    this.luminosity = luminosity || 0;
    this.color = color || this.generateColor(this.luminosity,this.mass,this.radius);
    this.exists = true;
    this.id = -1
}

Body.prototype = {
    /**
     * Modifies attributes of the body
     *
     * @param {Object} body - A body-like object
     */

    update: function(body) {

        if (body.position) {
          var x = parseFloat(body.position.x);
          var y = parseFloat(body.position.y);
          this.position.x = x === 0 ? 0 : x || this.position.x;
          this.position.y = y === 0 ? 0 : y || this.position.y;
        }

        if (body.velocity) {
          var x = parseFloat(body.velocity.x);
          var y = parseFloat(body.velocity.y);
          this.velocity.x = x === 0 ? 0 : x || this.velocity.x;
          this.velocity.y = y === 0 ? 0 : y || this.velocity.y;
        }

        if (body.luminosity) {
            var parsedLuminosity = parseFloat(body.luminosity);
            if (isNaN(parsedLuminosity)) {
                this.luminosity = 0;
            }
            else {
                this.luminosity = Math.max(0,parsedLuminosity);
                if (this.luminosity >0) {
                    this.color = this.generateColor(this.luminosity, this.mass,this.radius);
                }                
            }
        }
        else if(['darkturquoise','darkseagreen','lightsalmon','plum','lightsteelblue','lightseagreen','lightgreen'].indexOf(this.color)<0){
            this.color = this.generateColor(0, this.mass,this.radius);
        }

        var mass = Math.max(0,parseFloat(body.mass));
        var radius = Math.max(0,parseFloat(body.radius));
        this.setMassRadius(mass === 0 ? this.mass : mass || this.mass , radius === 0 ? this.radius : radius || this.radius);

        this.color = body.color || this.color;
        this.hideHabitable = (body.hideHabitable ? true : false); // false if undef
    },

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
        this.force = this.force.add(force);
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
        " (" + this.name + ")" +
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
    },

    copy: function() {
        var newBody = new Body(
            this.mass,
            new Vector(this.position.x,this.position.y),
            new Vector(this.velocity.x,this.velocity.y),
            this.radius,
            this.luminosity,
            this.name,
            this.color
        );
        newBody.id = this.id;
        return newBody;
    },

    generateColor: function(luminosity,mass,radius) {
        //Constant from Stefan-Boltzmann Law
        var sigma = 5.6704 * Math.pow(10,-8);
        var color = 'mistyrose';

        if (luminosity > 0) {
            //convert solar units to watts for temp calculation
            var lum = luminosity * 3.827 * Math.pow(10,26);

            // this assumes that the radius is stored as the #.## term of #.## *10^8
            // meters, may need to change later
            var temp = Math.pow(lum / (4 * Math.PI * Math.pow(radius, 2) * sigma),.25);
            
            if (temp >= 28000) {
                color = '#1a1aff';
            } else if (temp >= 10000) {
                color = '#80d4ff';
            } else if (temp >= 7500) {
                color = '#ffffff';
            } else if (temp >= 6000) {
                color = '#ffff80';
            } else if (temp >= 4900) {
                color = '#ffff1a';
            } else if (temp >= 3500) {
                color = '#ff6600';
            } else {
                color = '#ff0000';
            }
        } else {
            return _.sample(['darkturquoise','darkseagreen','lightsalmon','plum','lightsteelblue','lightseagreen','lightgreen']);
        }
        return color;
    }
};

module.exports = Body;
