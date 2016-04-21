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
 * Constucts a new note.
 *
 * @constructor
 * @param {Object}  note       - Object that stores any of the attributes that want to be passed in constructor
 */

function Note(note) {

    this.position  = note.position  || new Vector(0,0);
    this.startTime = note.startTime || 0;
    this.duration  = note.duration  || 100000000;
    this.title     = note.title     || "Note";
    this.text      = note.text      || "Look!";
    this.id        = note.id;       
    
}

Note.prototype = {
    /**
     * Checks if the note should be shown given current time
     *
     * @param {Number} currentTime - current time stamp
     */
    
    check: function(currentTime) {
       return (currentTime >= this.startTime && currentTime <= (this.startTime + this.duration)); 
    },

    /**
     * Returns note info in string forms
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
