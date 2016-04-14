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

function Note(note) {

    this.position  = note.position  || new Vector(0,0);
    this.startTime = note.startTime || 0;
    this.duration  = note.duration  || 5;
    this.title     = note.title     || "Note";
    this.text      = note.text      || "Look!";
    
}

Note.prototype = {
    /**
     * Modifies attributes of the body
     *
     * @param {Object} body - A body-like object
     */
    
    check: function(currentTime) {
       return (currentTime >= this.startTime && currentTime <= (this.startTime + this.duration)); 
    },

    /**
     * Returns body info in string form
     *
     */
    toString: function() {
        return " S: " + this.startTime +
        " D: " + this.duration + 
        " P: " + this.position.toString() + 
        " TITLE: " + this.title + 
        " TEXT: " + this.text;
    }
};

module.exports = Note;
